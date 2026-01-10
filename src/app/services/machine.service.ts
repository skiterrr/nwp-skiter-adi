import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Machine } from '../models/machine';

export interface MachineSearchParams {
  name?: string;
  state?: ('ON' | 'OFF')[];          // backend: ?state=ON&state=OFF
  dateFrom?: string;                // yyyy-mm-dd
  dateTo?: string;                  // yyyy-mm-dd
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
}
