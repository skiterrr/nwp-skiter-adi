export enum MachineState {
  OFF = 'OFF',
  ON = 'ON',
  BUSY = 'BUSY'
}

export interface Machine {
  id: number;
  name: string;
  type?: string;
  description?: string;
  ownerUserId: number;
  ownerEmail?: string;
  state: MachineState;
  createdAt: string;
  active: boolean;
}
