import { Injectable } from '@angular/core';
import { User } from '../models/user';
import { MOCK_USERS } from '../mock/mock-users';

@Injectable({ providedIn: 'root' })
export class UserStoreService {
  // private users: User[] = [...MOCK_USERS];
  //
  // list(): User[] {
  //   return [...this.users];
  // }
  //
  // create(user: Omit<User, 'id'>): User {
  //   if (this.users.some(u => u.email.toLowerCase() === user.email.toLowerCase())) {
  //     throw new Error('Email vec postoji');
  //   }
  //   const id = this.users.length ? Math.max(...this.users.map(u => u.id)) + 1 : 1;
  //   const newUser: User = { id, ...user };
  //   this.users.push(newUser);
  //   return newUser;
  // }
  //
  // update(id: number, user: Partial<Omit<User, 'id'>>): User {
  //
  //   const idx = this.users.findIndex(u => u.id === id);
  //
  //   if (user.email) {
  //     const newEmail = user.email.trim().toLowerCase();
  //     const exists = this.users.some(u => u.id !== id && u.email.trim().toLowerCase() === newEmail);
  //     if (exists) throw new Error('Email vec postoji');
  //     user.email = newEmail;
  //   }
  //   this.users[idx] = { ...this.users[idx], ...user };
  //   return this.users[idx];
  // }
  //
  // findById(id: number): User | undefined{
  //   return this.users.find(u => u.id === id);
  // }
  //
  // delete(id: number): void {
  //   this.users = this.users.filter(u => u.id !== id);
  //   console.log(this.users);
  //   console.log(MOCK_USERS);
  // }
}
