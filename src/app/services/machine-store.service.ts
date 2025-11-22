import { Injectable } from '@angular/core';
import { Machine, MachineState } from '../models/machine';
import { MOCK_MACHINES } from '../mock/mock-machines';
import { AuthService } from './auth.service';
import {MOCK_ERROR_LOGS} from "../mock/mock-errorLogs";

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

  // destroy(id: number) {
  //   const machine = MOCK_MACHINES.find(m => m.id === id);
  //   if (!machine) throw new Error('Masina nije pronadjena.');
  //   if (machine.state !== MachineState.OFF) throw new Error('Masina mora biti ugasena da bi se unistila.');
  //   machine.active = false;
  // }

  start(id: number): Promise<void> {
    const machine = MOCK_MACHINES.find(m => m.id === id);
    if (!machine) return Promise.reject('Masina nije pronadjena.');
    if (machine.state !== MachineState.OFF) return Promise.reject('Masina vec radi ili nije ugasena.');

    machine.state = 'POKRETANJE...' as any;
    console.log(`Paljenje masine ${machine.name}...`);

    return new Promise((resolve) => {
      setTimeout(() => {
        machine.state = MachineState.ON;
        console.log(`Masina ${machine.name} je uspesno upaljena.`);
        resolve();
      }, 10000);
    });
  }

  stop(id: number): Promise<void> {
    const machine = MOCK_MACHINES.find(m => m.id === id);
    if (!machine) return Promise.reject('Masina nije pronadjena.');
    if (machine.state !== MachineState.ON) return Promise.reject('Masina mora biti upaljena da bi se ugasila.');

    machine.state = 'GASENJE...' as any;
    console.log(`Gasenje masine ${machine.name}...`);

    return new Promise((resolve) => {
      setTimeout(() => {
        machine.state = MachineState.OFF;
        console.log(`Masina ${machine.name} je uspesno ugasena.`);
        resolve();
      }, 10000);
    });
  }

  restart(id: number): Promise<void> {
    const machine = MOCK_MACHINES.find(m => m.id === id);
    if (!machine) return Promise.reject('Masina nije pronadjena.');
    if (machine.state !== MachineState.ON) return Promise.reject('Masina mora biti upaljena da bi se restartovala.');

    machine.state = 'RESTARTOVANJE...' as any;
    console.log(`Restartovanje masine ${machine.name}...`);

    return new Promise((resolve) => {
      setTimeout(() => {
        machine.state = MachineState.OFF;
        console.log(`Masina ${machine.name} ugasena (1/2 restarta).`);

        setTimeout(() => {
          machine.state = MachineState.ON;
          console.log(`Masina ${machine.name} ponovo upaljena.`);
          resolve();
        }, 5000);
      }, 5000);
    });
  }

  schedule(id: number, operation: 'START' | 'STOP' | 'RESTART', date: string) {
    const executeTime = new Date(date).getTime();
    const now = Date.now();

    if (executeTime <= now)
      throw new Error("Ne mozete zakazati operaciju u proslosti.");

    const machine = MOCK_MACHINES.find(m => m.id === id);
    if (!machine) throw new Error("Masina nije pronadjena.");

    console.log(`Operacija ${operation} zakazana za ${machine.name} u ${date}`);

    setTimeout(() => {
      console.log("Pokrenuta zakazana operacija", operation);

      let promise;

      switch (operation) {
        case 'START':
          promise = this.start(id);
          break;
        case 'STOP':
          promise = this.stop(id);
          break;
        case 'RESTART':
          promise = this.restart(id);
          break;
      }

      promise?.catch(msg => {
        this.logError({
          machineId: machine.id,
          machineName: machine.name,
          operation,
          message: msg,
          ownerEmail: machine.ownerEmail || "",
          date: new Date().toISOString()
        });
      });

    }, executeTime - now);
  }

  private logError(err: {
    machineId: number,
    machineName: string,
    operation: string,
    message: string,
    date: string,
    ownerEmail: string
  }) {
    const newId = Math.max(...MOCK_ERROR_LOGS.map(e => e.id)) + 1;
    MOCK_ERROR_LOGS.push({ id: newId, ...err });
  }

}
