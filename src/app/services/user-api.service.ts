import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user';
import {UserDto} from "../models/UserDto";
import {Permission} from "../models/permission";

export type UpdateUserPayload = {
  firstName?: string;
  lastName?: string;
  password?: string;
  active?: boolean;
  permissions?: Permission[];
};

export type CreateUserRequest = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  active: boolean;
  permissions: string[];
};

@Injectable({ providedIn: 'root' })
export class UserApiService {


  private apiUrl = 'http://localhost:8080/users';

  constructor(private http: HttpClient) {}

  getAll(): Observable<UserDto[]> {
    return this.http.get<UserDto[]>(this.apiUrl);
  }

  getById(id: number): Observable<UserDto> {
    return this.http.get<UserDto>(`${this.apiUrl}/${id}`);
  }

  createUser(body: CreateUserRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}`, body);
  }

  update(id: number, body: UpdateUserPayload) {
    return this.http.patch<User>(`${this.apiUrl}/${id}`, body);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

}
