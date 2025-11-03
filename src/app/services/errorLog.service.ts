import { Injectable } from '@angular/core';
import { MOCK_ERROR_LOGS } from '../mock/mock-errorLogs';
import { ErrorLog } from '../models/errorLog';
import { AuthService } from './auth.service';
import { Permission } from '../models/permission';

@Injectable({ providedIn: 'root' })
export class ErrorLogService {
  constructor(private auth: AuthService) {}

  list(): ErrorLog[] {
    const user = this.auth.currentUser;
    if (!user) return [];

    const isAdmin = user.permissions.includes(Permission.USER_CREATE) &&
      user.permissions.includes(Permission.USER_DELETE) &&
      user.permissions.includes(Permission.MACHINE_SEARCH);

    if (isAdmin) return MOCK_ERROR_LOGS;

    return MOCK_ERROR_LOGS.filter(log => log.ownerEmail === user.email);
  }
}
