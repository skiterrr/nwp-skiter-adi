import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {LoginComponent} from "./login/login.component";
import {UsersListComponent} from "./users/users-list/users-list.component";
import {AuthGuard} from "./guards/auth.guard";
import {UserCreateComponent} from "./users/user-create/user-create.component";
import {UserEditComponent} from "./users/user-edit/user-edit.component";
import {MachinesSearchComponent} from "./components/machines-search/machines-search.component";
import {MachineCreateComponent} from "./components/machine-create/machine-create.component";
import {ErrorHistoryComponent} from "./components/error-history/error-history.component";

const routes: Routes = [
  { path: 'login', component: LoginComponent, canActivate: [AuthGuard] },
  { path: 'users', component: UsersListComponent, canActivate: [AuthGuard] },
  { path: '', redirectTo: '/auto-redirect', pathMatch: 'full'},
  { path: 'auto-redirect', canActivate: [AuthGuard], component: LoginComponent },
  { path: 'users/new', component: UserCreateComponent, canActivate: [AuthGuard] },
  { path: 'users/:id/edit', component: UserEditComponent, canActivate: [AuthGuard] },
  { path: 'machines', component: MachinesSearchComponent, canActivate: [AuthGuard]},
  { path: 'machines/new', component: MachineCreateComponent, canActivate: [AuthGuard] },
  { path: 'errors', component: ErrorHistoryComponent, canActivate: [AuthGuard] }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
