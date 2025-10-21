import {Component} from '@angular/core';
import {MOCK_USERS} from "../../mock/mock-users";
import {User} from "../../models/user";

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.css']
})
export class UsersListComponent {
  users: User[] = [];

  ngOnInit(): void {
    this.users = [...MOCK_USERS];
  }
}
