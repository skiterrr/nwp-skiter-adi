import { Injectable } from '@angular/core';
import { MOCK_USERS } from '../mock/mock-users';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private currentUserKey = 'currentUserEmail';

  login(email: string, password: string): boolean {
    const user = MOCK_USERS.find(u => u.email === email && u.password === password);
    if (!user) return false;

    localStorage.setItem(this.currentUserKey, user.email);
    return true;
  }

  logout() {
    localStorage.removeItem(this.currentUserKey);
  }

  get currentUser() {
    const email = localStorage.getItem(this.currentUserKey);
    return MOCK_USERS.find(u => u.email === email) || null;
  }

  get isLoggedIn() {
    return !!this.currentUser;
  }
}
