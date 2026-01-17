import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ErrorLog } from '../models/errorLog';

@Injectable({ providedIn: 'root' })
export class ErrorLogService {
  private base = 'http://localhost:8080/machines/errors';

  constructor(private http: HttpClient) {}

  getErrors(): Observable<ErrorLog[]> {
    return this.http.get<ErrorLog[]>(this.base);
  }
}
