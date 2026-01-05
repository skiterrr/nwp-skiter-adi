import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import { UsersListComponent } from './users/users-list/users-list.component';
import { UserCreateComponent } from './users/user-create/user-create.component';
import { UserEditComponent } from './users/user-edit/user-edit.component';
import { MachinesSearchComponent } from './components/machines-search/machines-search.component';
import { MachineCreateComponent } from './components/machine-create/machine-create.component';
import { ErrorHistoryComponent } from './components/error-history/error-history.component';
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {AuthTokenInterceptor} from "./interceptor/auth.token.interceptor";

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    UsersListComponent,
    UserCreateComponent,
    UserEditComponent,
    MachinesSearchComponent,
    MachineCreateComponent,
    ErrorHistoryComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [{ provide: HTTP_INTERCEPTORS, useClass: AuthTokenInterceptor, multi: true }],
  bootstrap: [AppComponent]
})
export class AppModule { }
