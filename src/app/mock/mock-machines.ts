import { Machine, MachineState } from '../models/machine';

export const MOCK_MACHINES: Machine[] = [
  {
    id: 1,
    name: 'CNC-01',
    ownerUserId: 2,
    ownerEmail: 'mila.markovic@raf.rs',
    state: MachineState.OFF,
    createdAt: '2025-09-10T10:00:00Z',
    active: true
  },
  {
    id: 2,
    name: 'Lathe-02',
    ownerUserId: 3,
    ownerEmail: 'nikola.ilic@raf.rs',
    state: MachineState.ON,
    createdAt: '2025-09-11T09:30:00Z',
    active: true
  },
  {
    id: 3,
    name: 'Mill-03',
    ownerUserId: 5,
    ownerEmail: 'ana.kostic@raf.rs',
    state: MachineState.BUSY,
    createdAt: '2025-09-12T08:45:00Z',
    active: true
  },
  {
    id: 4,
    name: 'Robot-04',
    ownerUserId: 6,
    ownerEmail: 'luka.mihajlovic@raf.rs',
    state: MachineState.OFF,
    createdAt: '2025-09-15T13:20:00Z',
    active: true
  },
  {
    id: 5,
    name: 'Press-05',
    ownerUserId: 7,
    ownerEmail: 'ivana.popovic@raf.rs',
    state: MachineState.ON,
    createdAt: '2025-09-17T15:10:00Z',
    active: true
  },
  {
    id: 6,
    name: 'Cutter-06',
    ownerUserId: 8,
    ownerEmail: 'stefan.dj@raf.rs',
    state: MachineState.BUSY,
    createdAt: '2025-09-18T11:00:00Z',
    active: true
  },
  {
    id: 7,
    name: 'Welder-07',
    ownerUserId: 9,
    ownerEmail: 'teodora.stankovic@raf.rs',
    state: MachineState.ON,
    createdAt: '2025-09-20T10:30:00Z',
    active: true
  },
  {
    id: 8,
    name: 'Drill-08',
    ownerUserId: 10,
    ownerEmail: 'vuk.radovic@raf.rs',
    state: MachineState.OFF,
    createdAt: '2025-09-22T09:15:00Z',
    active: true
  },
  {
    id: 9,
    name: 'Laser-09',
    ownerUserId: 4,
    ownerEmail: 'petar.jovanovic@raf.rs',
    state: MachineState.BUSY,
    createdAt: '2025-09-23T08:00:00Z',
    active: true
  },
  {
    id: 10,
    name: '3DPrinter-10',
    ownerUserId: 1,
    ownerEmail: 'admin@raf.rs',
    state: MachineState.ON,
    createdAt: '2025-09-25T12:00:00Z',
    active: true
  }
];
