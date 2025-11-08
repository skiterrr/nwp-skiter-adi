import {Injectable} from '@angular/core';
import {MOCK_USERS} from '../mock/mock-users';
import {Permission} from "../models/permission";

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

  hasPermission(permission: Permission): boolean {
    const user = this.currentUser;
    if(!user) return false;
    console.log("Ima permission: " + permission);
    return user.permissions.length > 0 && user.permissions.includes(permission);
  }

  hasCreateUserPermission():boolean{
    const user = this.currentUser;
    if(!user) return false;
    console.log("OVAJ USER IMA CREATE PERMISSION");
    return user.permissions.length > 0 && user.permissions.includes(Permission.USER_CREATE);
  }
}
