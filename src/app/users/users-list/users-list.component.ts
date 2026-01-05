import { Component } from '@angular/core';
import { User } from "../../models/user";
import { Router } from "@angular/router";
import { UserStoreService } from "../../services/user-store.service"; // ostaje
import { AuthService } from "../../services/auth.service";
import { Permission } from "../../models/permission";
import { UserApiService } from "../../services/user-api.service";
import {UserDto} from "../../models/UserDto";

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.css']
})
export class UsersListComponent {
  users: UserDto[] = [];

  canRead = false;
  canUpdate = false;
  canDelete = false;

  constructor(
    private router: Router,
    private store: UserStoreService,
    private auth: AuthService,
    private userApi: UserApiService
  ) {}

  ngOnInit(): void {
    this.canRead = this.auth.hasPermission(Permission.USER_READ);
    this.canUpdate = this.auth.hasPermission(Permission.USER_UPDATE);
    this.canDelete = this.auth.hasPermission(Permission.USER_DELETE);

    if (this.canRead) {
      this.loadUsersFromApi();
    }
  }

  loadUsersFromApi(): void {
    this.userApi.getAll().subscribe({
      next: (users) => this.users = users,
      error: (err) => {
        if (err.status === 403) {
          this.canRead = false;
          this.users = [];
        }
      }
    });
  }

  onEdit(u: UserDto) {
    this.router.navigate(['/users', u.id, 'edit']);
  }

  onDelete(u: UserDto): void {
    if (!confirm(`Obrisati korisnika ${u.email}?`)) return;

    this.userApi.delete(u.id).subscribe({
      next: () => this.loadUsersFromApi(),
      error: (err) => {
        if (err.status === 403) {
          alert('Nemate dozvolu za brisanje korisnika.');
        } else {
          alert('Greška pri brisanju korisnika.');
        }
      }
    });
  }

  protected readonly Permission = Permission;
}
