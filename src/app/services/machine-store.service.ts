import { Injectable } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { Machine } from '../models/machine';
import { MachineService, MachineSearchParams, ScheduleOperationRequest, ScheduledOperation, ErrorLog } from './machine.service';
import { MachineWsService } from '../services/machine.ws.service';

export interface MachineSearchArgs {
  name?: string;
  ownerEmail?: string;
  states?: Array<'ON' | 'OFF'>;
  fromDate?: string;
  toDate?: string;
}

@Injectable({ providedIn: 'root' })
export class MachineStoreService {
  private machinesSubject = new BehaviorSubject<Machine[]>([]);
  machines$ = this.machinesSubject.asObservable();


  private errorsSubject = new BehaviorSubject<ErrorLog[]>([]);
  errors$ = this.errorsSubject.asObservable();


  private wsSub?: Subscription;

  constructor(
    private api: MachineService,
    private ws: MachineWsService
  ) {}


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

  schedule(id: number, operation: 'START' | 'STOP' | 'RESTART', scheduledTime: string): Promise<ScheduledOperation> {
    return new Promise((resolve, reject) => {
      const request: ScheduleOperationRequest = { operation, scheduledTime };
      this.api.scheduleOperation(id, request).subscribe({
        next: (scheduled) => resolve(scheduled),
        error: (err) => reject(err)
      });
    });
  }

  loadErrors(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.api.getErrors().subscribe({
        next: (errors) => {
          this.errorsSubject.next(errors);
          resolve();
        },
        error: (err) => reject(err)
      });
    });
  }


  getErrors(): ErrorLog[] {
    return this.errorsSubject.value;
  }

  listVisible(): Machine[] {
    return this.machinesSubject.value;
  }


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
