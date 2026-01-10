// export enum MachineState {
//   OFF = 'OFF',
//   ON = 'ON',
//   BUSY = 'BUSY'
// }
//
// export interface Machine {
//   id: number;
//   name: string;
//   type?: string;
//   description?: string;
//   ownerUserId: number;
//   ownerEmail?: string;
//   state: MachineState;
//   createdAt: string;
//   active: boolean;
// }
export type MachineState = 'ON' | 'OFF';
export type MachineOperation = 'START' | 'STOP' | 'RESTART';

export interface Machine {
  id: number;
  name: string;
  state: MachineState;

  createdByUserId: number;

  active: boolean;
  createdAt: string; // ISO

  operationInProgress: boolean;
  pendingOperation?: MachineOperation | null;
}

