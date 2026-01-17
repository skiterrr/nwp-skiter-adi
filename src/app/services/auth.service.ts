import {Injectable} from '@angular/core';
import {MOCK_USERS} from '../mock/mock-users';
import {Permission} from "../models/permission";
import {HttpClient} from "@angular/common/http";
import {BehaviorSubject, map, Observable, tap} from "rxjs";
import {UserDto} from "../models/UserDto";

type LoginResponse = { token: string };

@Injectable({ providedIn: 'root' })
export class AuthService {
  private currentUserKey = 'currentUserEmail';

  get currentUser() {
    const email = localStorage.getItem(this.currentUserKey);
    return MOCK_USERS.find(u => u.email === email) || null;
  }

  private me_ = new BehaviorSubject<UserDto | null>(null);

  loadMe(): Observable<UserDto> {
    return this.http.get<UserDto>(`${this.apiUrl}/auth/me`).pipe(
      tap(me => this.me_.next(me))
    );
  }

  get me(): UserDto | null {
    return this.me_.value;
  }

  hasPermission(permission: Permission): boolean {
    const me = this.me;
    if (me) {
      return (me.permissions ?? []).includes(permission);
    }

    const user = this.currentUser;
    if (!user) return false;
    return user.permissions?.includes(permission) ?? false;
  }

  private apiUrl = "http://localhost:8080";

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<boolean> {
    return this.http
      .post<LoginResponse>(`${this.apiUrl}/auth/login`, { email, password })
      .pipe(
        tap(res => localStorage.setItem("auth_token", res.token)),
        map(() => true)
      );
  }

  logout(): void {
    localStorage.removeItem("auth_token");
  }

  getToken(): string | null {
    return localStorage.getItem("auth_token");
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }
}
