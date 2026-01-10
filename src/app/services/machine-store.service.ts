import { Injectable } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { Machine } from '../models/machine';
import { MachineService, MachineSearchParams } from './machine.service';
import { MachineWsService } from '../services/machine.ws.service';

// ⬇⬇⬇ dodaj (kompatibilno sa starim komponentama)
export interface MachineSearchArgs {
  name?: string;
  ownerEmail?: string;              // više se NE koristi na backend-u, ignorišemo
  states?: Array<'ON' | 'OFF'>;     // ranije MachineState[]
  fromDate?: string;               // yyyy-mm-dd
  toDate?: string;                 // yyyy-mm-dd
}
// ⬆⬆⬆

@Injectable({ providedIn: 'root' })
export class MachineStoreService {
  private machinesSubject = new BehaviorSubject<Machine[]>([]);
  machines$ = this.machinesSubject.asObservable();

  private wsSub?: Subscription;

  constructor(
    private api: MachineService,
    private ws: MachineWsService
  ) {}

  // ---------------- WS ----------------

  connectWs(): void {
    this.ws.connect();
    if (!this.wsSub) {
      this.wsSub = this.ws.machineUpdates().subscribe(updated => {
        const list = this.machinesSubject.value.slice();
        const idx = list.findIndex(m => m.id === updated.id);
        if (idx >= 0) {
          list[idx] = { ...list[idx], ...updated };
        } else {
          list.unshift(updated);
        }
        this.machinesSubject.next(list);
      });
    }
  }

  disconnectWs(): void {
    this.wsSub?.unsubscribe();
    this.wsSub = undefined;
    this.ws.disconnect();
  }

  // -------------- REST core --------------

  refresh(params?: MachineSearchParams): Promise<void> {
    return new Promise((resolve, reject) => {
      this.api.getMachines(params).subscribe({
        next: (list) => {
          this.machinesSubject.next(list);
          resolve();
        },
        error: (err) => reject(err)
      });
    });
  }

  async create(name: string): Promise<void> {
    await new Promise<void>((resolve, reject) => {
      this.api.createMachine(name).subscribe({
        next: (m) => {
          this.machinesSubject.next([m, ...this.machinesSubject.value]);
          resolve();
        },
        error: (err) => reject(err)
      });
    });
  }

  start(id: number): Promise<void> {
    return this.callOp(() => this.api.start(id), id);
  }

  stop(id: number): Promise<void> {
    return this.callOp(() => this.api.stop(id), id);
  }

  restart(id: number): Promise<void> {
    return this.callOp(() => this.api.restart(id), id);
  }

  destroy(id: number): Promise<void> {
    return new Promise((resolve, reject) => {
      this.api.destroy(id).subscribe({
        next: () => {
          this.machinesSubject.next(this.machinesSubject.value.filter(m => m.id !== id));
          resolve();
        },
        error: (err) => reject(err)
      });
    });
  }

  // -------------- COMPAT LAYER (da stare komponente rade) --------------

  // ✅ stare komponente zovu store.listVisible()
  listVisible(): Machine[] {
    return this.machinesSubject.value;
  }


  // ✅ za sada stub, dok ne odradimo backend scheduling
  schedule(id: number, operation: 'START' | 'STOP' | 'RESTART', date: string) {
    // kad uradimo backend scheduling, ovde ide HTTP POST
    console.warn('schedule() not implemented on backend yet', { id, operation, date });
  }

  // -------------- helpers --------------

  private callOp(req: () => any, id: number): Promise<void> {
    this.patchLocal(id, { operationInProgress: true });

    return new Promise((resolve, reject) => {
      req().subscribe({
        next: () => resolve(),
        error: (err: any) => {
          this.patchLocal(id, { operationInProgress: false });
          reject(err);
        }
      });
    });
  }

  private patchLocal(id: number, patch: Partial<Machine>): void {
    const list = this.machinesSubject.value.slice();
    const idx = list.findIndex(m => m.id === id);
    if (idx >= 0) {
      list[idx] = { ...list[idx], ...patch };
      this.machinesSubject.next(list);
    }
  }
}

