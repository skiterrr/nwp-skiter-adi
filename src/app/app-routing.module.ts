import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {LoginComponent} from "./login/login.component";
import {UsersListComponent} from "./users/users-list/users-list.component";
import {AuthGuard} from "./guards/auth.guard";
import {UserCreateComponent} from "./users/user-create/user-create.component";
import {UserEditComponent} from "./users/user-edit/user-edit.component";

const routes: Routes = [
  { path: 'login', component: LoginComponent, canActivate: [AuthGuard] },
  { path: 'users', component: UsersListComponent, canActivate: [AuthGuard] },
  { path: '', redirectTo: '/auto-redirect', pathMatch: 'full'},
  { path: 'auto-redirect', canActivate: [AuthGuard], component: LoginComponent },
  { path: 'users/new', component: UserCreateComponent, canActivate: [AuthGuard] },
  { path: 'users/:id/edit', component: UserEditComponent, canActivate: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
