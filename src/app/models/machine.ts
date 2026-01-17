
export type MachineState = 'ON' | 'OFF';
export type MachineOperation = 'START' | 'STOP' | 'RESTART';

export interface Machine {
  id: number;
  name: string;
  state: MachineState;

  createdByUserId: number;
  createdByEmail: string;
  active: boolean;
  createdAt: string;

  operationInProgress: boolean;
  pendingOperation?: MachineOperation | null;
}

