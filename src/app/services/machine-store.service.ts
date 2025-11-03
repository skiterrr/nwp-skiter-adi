import { Injectable } from '@angular/core';
import { Machine, MachineState } from '../models/machine';
import { MOCK_MACHINES } from '../mock/mock-machines';
import { AuthService } from './auth.service';

export interface MachineSearchArgs {
  name?: string;
  ownerEmail?: string;
  states?: MachineState[];
  fromDate?: string;
  toDate?: string;
}

@Injectable({ providedIn: 'root' })
export class MachineStoreService {
  constructor(private auth: AuthService) {}

  listVisible(): Machine[] {
    const user = this.auth.currentUser;
    if (!user) return [];

    // Admin vidi sve mašine
    if (user.email === 'admin@raf.rs') {
      return MOCK_MACHINES.filter(m => m.active);
    }

    return MOCK_MACHINES.filter(m => m.ownerEmail === user.email && m.active);
  }

  search(args: MachineSearchArgs): Machine[] {
    let list = this.listVisible();

    if (args.name?.trim()) {
      const q = args.name.trim().toLowerCase();
      list = list.filter(m => m.name.toLowerCase().includes(q));
    }

    if (args.ownerEmail?.trim()) {
      const q = args.ownerEmail.trim().toLowerCase();
      list = list.filter(m => m.ownerEmail?.toLowerCase().includes(q));
    }

    if (args.states?.length) {
      const set = new Set(args.states);
      list = list.filter(m => set.has(m.state));
    }

    if (args.fromDate || args.toDate) {
      const from = args.fromDate ? new Date(args.fromDate) : null;
      const to = args.toDate ? new Date(args.toDate) : null;
      list = list.filter(m => {
        const created = new Date(m.createdAt);
        return (!from || created >= from) && (!to || created <= to);
      });
    }

    return list;
  }
  create(machine: Machine) {
    let list = this.listVisible();
    let exist = list.some(m =>
    m.name.trim().toLowerCase() === machine.name.trim().toLowerCase());
    if (exist){
      throw new Error(`Masina sa tim imenom vec postoji!`);
    }
    const newId = Math.max(...MOCK_MACHINES.map(m => m.id)) + 1;
    MOCK_MACHINES.push({ ...machine, id: newId });
  }

  destroy(id: number) {
    const machine = MOCK_MACHINES.find(m => m.id === id);
    if (!machine) throw new Error('Mašina nije pronađena.');
    if (machine.state !== MachineState.OFF) throw new Error('Mašina mora biti ugašena da bi se uništila.');
    machine.active = false;
  }

  start(id: number): Promise<void> {
    const machine = MOCK_MACHINES.find(m => m.id === id);
    if (!machine) return Promise.reject('Mašina nije pronađena.');
    if (machine.state !== MachineState.OFF) return Promise.reject('Mašina već radi ili nije ugašena.');

    machine.state = 'POKRETANJE...' as any;
    console.log(`Paljenje mašine ${machine.name}...`);

    return new Promise((resolve) => {
      setTimeout(() => {
        machine.state = MachineState.ON;
        console.log(`Mašina ${machine.name} je uspešno upaljena.`);
        resolve();
      }, 10000); // 10 sekundi simulacije
    });
  }

  stop(id: number): Promise<void> {
    const machine = MOCK_MACHINES.find(m => m.id === id);
    if (!machine) return Promise.reject('Mašina nije pronađena.');
    if (machine.state !== MachineState.ON) return Promise.reject('Mašina mora biti upaljena da bi se ugasila.');

    machine.state = 'GAŠENJE...' as any;
    console.log(`Gašenje mašine ${machine.name}...`);

    return new Promise((resolve) => {
      setTimeout(() => {
        machine.state = MachineState.OFF;
        console.log(`Mašina ${machine.name} je uspešno ugašena.`);
        resolve();
      }, 10000);
    });
  }

  restart(id: number): Promise<void> {
    const machine = MOCK_MACHINES.find(m => m.id === id);
    if (!machine) return Promise.reject('Mašina nije pronađena.');
    if (machine.state !== MachineState.ON) return Promise.reject('Mašina mora biti upaljena da bi se restartovala.');

    machine.state = 'RESTARTOVANJE...' as any;
    console.log(`Restartovanje mašine ${machine.name}...`);

    return new Promise((resolve) => {
      setTimeout(() => {
        machine.state = MachineState.OFF;
        console.log(`Mašina ${machine.name} ugašena (1/2 restarta).`);

        setTimeout(() => {
          machine.state = MachineState.ON;
          console.log(`Mašina ${machine.name} ponovo upaljena.`);
          resolve();
        }, 5000);
      }, 5000);
    });
  }
}
