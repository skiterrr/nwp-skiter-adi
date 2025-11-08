import {Component} from '@angular/core';
import {User} from "../../models/user";
import {Router} from "@angular/router";
import {UserStoreService} from "../../services/user-store.service";
import {AuthService} from "../../services/auth.service";
import {Permission} from "../../models/permission";

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.css']
})
export class UsersListComponent {
  users: User[] = [];

  canRead = false;
  canUpdate = false;
  canDelete = false;

  ngOnInit(): void {
    this.canRead = this.auth.hasPermission(Permission.USER_READ);
    this.canUpdate = this.auth.hasPermission(Permission.USER_UPDATE);
    this.canDelete = this.auth.hasPermission(Permission.USER_DELETE);

    if (this.canRead) {
      this.users = this.store.list();
    }
  }

  constructor(private router: Router, private store: UserStoreService, private auth: AuthService) {
  }

  loadUsers(){
    this.users = this.store.list();
  }

  onEdit(u: User) {
    this.router.navigate(['/users', u.id, 'edit']);
  }

  onDelete(u: User) {
    this.store.delete(u.id);
    this.loadUsers();
  }

  protected readonly Permission = Permission;
}
