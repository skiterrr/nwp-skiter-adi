import { Component } from '@angular/core';
import {FormArray, FormBuilder, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {Permission} from "../../models/permission";
import {UserStoreService} from "../../services/user-store.service";
import {MOCK_USERS} from "../../mock/mock-users";
import {PermissionsApiService} from "../../services/permissions-api.service";
import {UserApiService} from "../../services/user-api.service";

@Component({
  selector: 'app-user-create',
  templateUrl: './user-create.component.html',
  styleUrls: ['./user-create.component.css']
})
export class UserCreateComponent {

  allPermissions: string[] = []; // dolazi sa backend-a

  submitting = false;
  error = '';

  form = this.fb.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(4)]],
    active: [true],
    permissions: this.fb.array<boolean>([])
  });

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private permissionsService: PermissionsApiService,
    private userApi: UserApiService
  ) {}

  get permissionsArray(): FormArray {
    return this.form.get('permissions') as FormArray;
  }

  ngOnInit(): void {
    this.permissionsService.getAll().subscribe({
      next: (perms) => {
        this.allPermissions = perms; // npr ["USER_CREATE", ...]
        const checks = this.allPermissions.map(() => false);
        this.form.setControl('permissions', this.fb.array(checks));
      },
      error: () => {
        // fallback (da ti ne pukne forma ako /permissions ne radi)
        this.allPermissions = Object.values(Permission);
        const checks = this.allPermissions.map(() => false);
        this.form.setControl('permissions', this.fb.array(checks));
      }
    });
  }

  onSubmit(): void {
    this.error = '';
    if (this.form.invalid) return;

    this.submitting = true;

    const v = this.form.value;
    const selectedPerms = this.allPermissions.filter((_, i) => !!this.permissionsArray.value[i]);

    const payload = {
      firstName: v.firstName!,
      lastName: v.lastName!,
      email: v.email!,
      password: v.password!,
      active: v.active ?? true,
      permissions: selectedPerms
    };

    this.userApi.createUser(payload).subscribe({
      next: () => this.router.navigate(['/users']),
      error: (err) => {
        this.error = err?.error?.message ?? 'Greska pri dodavanju korisnika';
        this.submitting = false;
      },
      complete: () => (this.submitting = false)
    });
  }
}
