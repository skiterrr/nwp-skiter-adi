import {Component} from '@angular/core';
import {MOCK_USERS} from "../../mock/mock-users";
import {User} from "../../models/user";
import {Router} from "@angular/router";
import {UserStoreService} from "../../services/user-store.service";

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.css']
})
export class UsersListComponent {
  users: User[] = [];

  ngOnInit(): void {
    this.users = this.store.list();
  }

  constructor(private router: Router, private store: UserStoreService) {
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
}
