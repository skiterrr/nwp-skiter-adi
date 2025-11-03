import { ErrorLog } from '../models/errorLog';

export const MOCK_ERROR_LOGS: ErrorLog[] = [
  {
    id: 1,
    machineId: 2,
    machineName: 'CNC-11',
    operation: 'UPALI',
    message: 'Mašina nije mogla da se pokrene jer je već bila uključena.',
    date: '2025-10-29T10:21:00Z',
    ownerEmail: 'luka.mihajlovic@raf.rs'
  },
  {
    id: 2,
    machineId: 4,
    machineName: 'Server-1',
    operation: 'UGASI',
    message: 'Neuspešno gašenje mašine zbog aktivnog procesa.',
    date: '2025-10-30T15:12:00Z',
    ownerEmail: 'ana.kostic@raf.rs'
  },
  {
    id: 3,
    machineId: 7,
    machineName: 'Test-Machine',
    operation: 'RESTART',
    message: 'Restart neuspešan — mašina nije bila uključena.',
    date: '2025-10-31T18:45:00Z',
    ownerEmail: 'stefan.dj@raf.rs'
  }
];
