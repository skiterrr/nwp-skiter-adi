import { User } from '../models/user';
import {Permission} from "../models/permission";

export const MOCK_USERS: User[] = [
  {
    id: 1,
    firstName: 'Admin',
    lastName: 'User',
    email: 'admin@raf.rs',
    password: 'admin',
    permissions: Object.values(Permission)
  },
  {
    id: 2,
    firstName: 'Mila',
    lastName: 'Marković',
    email: 'mila.markovic@raf.rs',
    password: 'mila123',
    permissions: [Permission.USER_READ, Permission.MACHINE_SEARCH]
  },
  {
    id: 3,
    firstName: 'Nikola',
    lastName: 'Ilić',
    email: 'nikola.ilic@raf.rs',
    password: 'nikola123',
    permissions: [Permission.USER_READ, Permission.USER_UPDATE, Permission.MACHINE_SEARCH]
  },
  {
    id: 4,
    firstName: 'Petar',
    lastName: 'Jovanović',
    email: 'petar.jovanovic@raf.rs',
    password: 'petar123',
    permissions: [Permission.USER_CREATE, Permission.USER_READ, Permission.USER_DELETE]
  },
  {
    id: 5,
    firstName: 'Ana',
    lastName: 'Kostić',
    email: 'ana.kostic@raf.rs',
    password: 'ana123',
    permissions: [Permission.MACHINE_SEARCH, Permission.MACHINE_START, Permission.MACHINE_STOP]
  },
  {
    id: 6,
    firstName: 'Luka',
    lastName: 'Mihajlović',
    email: 'luka.mihajlovic@raf.rs',
    password: 'luka123',
    permissions: [Permission.MACHINE_SEARCH, Permission.MACHINE_CREATE, Permission.MACHINE_DESTROY]
  },
  {
    id: 7,
    firstName: 'Ivana',
    lastName: 'Popović',
    email: 'ivana.popovic@raf.rs',
    password: 'ivana123',
    permissions: [Permission.USER_READ, Permission.MACHINE_SEARCH]
  },
  {
    id: 8,
    firstName: 'Stefan',
    lastName: 'Đorđević',
    email: 'stefan.dj@raf.rs',
    password: 'stefan123',
    permissions: [
      Permission.USER_READ,
      Permission.USER_UPDATE,
      Permission.MACHINE_SEARCH,
      Permission.MACHINE_RESTART
    ]
  },
  {
    id: 9,
    firstName: 'Teodora',
    lastName: 'Stanković',
    email: 'teodora.stankovic@raf.rs',
    password: 'teodora123',
    permissions: [Permission.USER_READ, Permission.MACHINE_SEARCH, Permission.MACHINE_START]
  },
  {
    id: 10,
    firstName: 'Vuk',
    lastName: 'Radović',
    email: 'vuk.radovic@raf.rs',
    password: 'vuk123',
    permissions: [Permission.MACHINE_SEARCH, Permission.MACHINE_RESTART, Permission.MACHINE_STOP]
  }
];
