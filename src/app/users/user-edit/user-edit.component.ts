import { Component } from '@angular/core';
import {User} from "../../models/user";
import {Permission} from "../../models/permission";
import {FormArray, FormBuilder, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {UserStoreService} from "../../services/user-store.service";

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.css']
})
export class UserEditComponent {
  id!: number;
  user!: User;
  error = '';
  saving = false;

  allPermissions = Object.values(Permission);

  form = this.fb.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(4)]],
    permissions: this.fb.array<boolean>([])
  });

  get permissionsArray(): FormArray {
    return this.form.get('permissions') as FormArray;
  }

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private store: UserStoreService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.id = Number(this.route.snapshot.paramMap.get('id'));
    const u = this.store.findById(this.id);
    if (!u) {
      this.error = 'Korisnik nije pronadjen';
      return;
    }
    this.user = u;

    const checks = this.allPermissions.map(p => u.permissions.includes(p));
    this.form.setControl('permissions', this.fb.array(checks));

    this.form.patchValue({
      firstName: u.firstName,
      lastName: u.lastName,
      email: u.email,
      password: u.password
    });
  }

  onSubmit() {
    this.error = '';
    if (this.form.invalid) return;

    this.saving = true;

    const value = this.form.value;
    const selectedPerms = this.allPermissions.filter((_, i) => this.permissionsArray.value[i]);

    try {
      this.store.update(this.id, {
        firstName: value.firstName!,
        lastName: value.lastName!,
        email: value.email!,
        password: value.password!,
        permissions: selectedPerms
      });
      this.router.navigate(['/users']);
    } catch (e: any) {
      this.error = e?.message ?? 'Greska pri cuvanju';
    } finally {
      this.saving = false;
    }
  }
}
