// src/app/guards/auth.guard.ts
import {Injectable} from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanDeactivate,
  Router,
  RouterStateSnapshot,
  UrlTree
} from '@angular/router';
import {Observable} from 'rxjs';
import {AuthService} from '../services/auth.service';
import {Permission} from "../models/permission";

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanDeactivate<unknown> {

  constructor(private router: Router, private auth: AuthService) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    const isLoggedIn = this.auth.isLoggedIn;
    const currentUrl = state.url;

    if (!isLoggedIn && currentUrl !== '/login') {
      this.router.navigate(['/login']);
      return false;
    }

    if (isLoggedIn && currentUrl === '/login') {
      this.router.navigate(['/users']);
      return false;
    }

    if(isLoggedIn && !this.auth.hasPermission(Permission.USER_CREATE) && currentUrl.startsWith('/users') && currentUrl.endsWith('edit')) {
      this.router.navigate(['/users']);
      return false;
    }

    if(isLoggedIn && !this.auth.hasPermission(Permission.USER_UPDATE) && currentUrl === '/users/:id/edit'){
      this.router.navigate(['/users']);
      return false;
    }

    if(isLoggedIn && currentUrl === "/auto-redirect") {
      this.router.navigate(['/users'])
    }
    return true;
  }

  canDeactivate(): boolean {
    return true;
  }
}
