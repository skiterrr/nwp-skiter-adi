import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

type PermissionsResponse = { permissions: string[] };

@Injectable({ providedIn: 'root' })
export class PermissionsApiService {
  private baseUrl = 'http://localhost:8080/permissions';

  constructor(private http: HttpClient) {}

  getAll(): Observable<string[]> {
    return this.http.get<PermissionsResponse>(this.baseUrl).pipe(
      map(r => r.permissions)
    );
  }
}
