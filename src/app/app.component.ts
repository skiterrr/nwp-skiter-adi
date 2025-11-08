import {Component} from '@angular/core';
import {AuthService} from "./services/auth.service";
import {Router} from "@angular/router";
import {Permission} from "./models/permission";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'nwp-projekat-adi-skiter';

  // hasCreateUserPermission = false;
  //
  // ngOnInit():void{
  //     this.hasCreateUserPermission = this.auth.hasPermission(Permission.USER_CREATE);
  // }

  constructor(public auth: AuthService, private router: Router) {}

  onLogout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }

  protected readonly Permission = Permission;
}
