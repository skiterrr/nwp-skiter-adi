import { Component } from '@angular/core';
import {FormArray, FormBuilder, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {Permission} from "../../models/permission";
import {UserStoreService} from "../../services/user-store.service";
import {MOCK_USERS} from "../../mock/mock-users";

@Component({
  selector: 'app-user-create',
  templateUrl: './user-create.component.html',
  styleUrls: ['./user-create.component.css']
})
export class UserCreateComponent {

  allPermissions = Object.values(Permission);

  form = this.fb.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(4)]],
    permissions: this.fb.array<boolean>(this.allPermissions.map(() => false))
  });

  submitting = false;
  error = '';

  constructor(
    private fb: FormBuilder,
    private store: UserStoreService,
    private router: Router
  ) {}

  get permissionsArray(): FormArray {
    return this.form.get('permissions') as FormArray;
  }

  onSubmit() {
    this.error = '';
    if (this.form.invalid) return;

    this.submitting = true;

    const value = this.form.value;
    const selectedPerms = this.allPermissions.filter((_, i) => this.permissionsArray.value[i]);

    try {
      this.store.create({
        firstName: value.firstName!,
        lastName: value.lastName!,
        email: value.email!,
        password: value.password!,
        permissions: selectedPerms
      });
      this.router.navigate(['/users']);
      console.log(this.store.list());
    } catch (e: any) {
      this.error = e?.message ?? 'Greska pri dodavanju korisnika';
    } finally {
      this.submitting = false;
    }
  }
}
