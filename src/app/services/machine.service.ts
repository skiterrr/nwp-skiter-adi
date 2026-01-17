import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Machine } from '../models/machine';

export interface MachineSearchParams {
  name?: string;
  state?: ('ON' | 'OFF')[];
  dateFrom?: string;
  dateTo?: string;
}

export interface ScheduleOperationRequest {
  operation: 'START' | 'STOP' | 'RESTART';
  scheduledTime: string;
}


export interface ScheduledOperation {
  id: number;
  operation: 'START' | 'STOP' | 'RESTART';
  scheduledTime: string;
  executed: boolean;
  machineId?: number;
}


export interface ErrorLog {
  id: number;
  timestamp: string;
  machineId: number;
  machineName: string;
  operation: 'START' | 'STOP' | 'RESTART';
  errorMessage: string;
}

@Injectable({ providedIn: 'root' })
export class MachineService {
  private base = `http://localhost:8080/machines`;

  constructor(private http: HttpClient) {}

  getMachines(params?: MachineSearchParams): Observable<Machine[]> {
    let httpParams = new HttpParams();

    if (params?.name) httpParams = httpParams.set('name', params.name);

    if (params?.state?.length) {
      params.state.forEach(s => {
        httpParams = httpParams.append('state', s);
      });
    }

    if (params?.dateFrom) httpParams = httpParams.set('dateFrom', params.dateFrom);
    if (params?.dateTo) httpParams = httpParams.set('dateTo', params.dateTo);

    return this.http.get<Machine[]>(this.base, { params: httpParams });
  }

  createMachine(name: string): Observable<Machine> {
    return this.http.post<Machine>(this.base, { name });
  }

  start(id: number): Observable<void> {
    return this.http.post<void>(`${this.base}/${id}/start`, {});
  }

  stop(id: number): Observable<void> {
    return this.http.post<void>(`${this.base}/${id}/stop`, {});
  }

  restart(id: number): Observable<void> {
    return this.http.post<void>(`${this.base}/${id}/restart`, {});
  }

  destroy(id: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}`);
  }

  scheduleOperation(id: number, request: ScheduleOperationRequest): Observable<ScheduledOperation> {
    return this.http.post<ScheduledOperation>(`${this.base}/${id}/schedule`, request);
  }

  getErrors(): Observable<ErrorLog[]> {
    return this.http.get<ErrorLog[]>(`${this.base}/errors`);
  }
}
