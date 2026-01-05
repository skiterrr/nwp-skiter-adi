import { Component } from '@angular/core';
import {User} from "../../models/user";
import {Permission} from "../../models/permission";
import {FormArray, FormBuilder, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {UserStoreService} from "../../services/user-store.service";
import {UpdateUserPayload, UserApiService} from "../../services/user-api.service";
import {UserDto} from "../../models/UserDto";
import {forkJoin} from "rxjs";
import {PermissionsApiService} from "../../services/permissions-api.service";

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.css']
})
export class UserEditComponent {
  id!: number;
  user!: UserDto;
  error = '';
  saving = false;

  allPermissions: string[] = [];

  form = this.fb.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    password: ['', Validators.minLength(4)],
    active: [true],
    permissions: this.fb.array<boolean>([])
  });

  get permissionsArray(): FormArray {
    return this.form.get('permissions') as FormArray;
  }

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private store: UserStoreService,
    private router: Router,
    private userApi: UserApiService,
    private permissionsApi: PermissionsApiService
  ) {}

  ngOnInit(): void {
    this.id = Number(this.route.snapshot.paramMap.get('id'));

    forkJoin({
      perms: this.permissionsApi.getAll(),
      user: this.userApi.getById(this.id)
    }).subscribe({
      next: ({ perms, user }) => {
        this.user = user;
        this.allPermissions = perms;

        const checks = this.allPermissions.map(p => (user.permissions ?? []).includes(p as any));
        this.form.setControl('permissions', this.fb.array(checks.map(v => this.fb.control(!!v))));

        this.form.patchValue({
          firstName: user.firstName,
          lastName: user.lastName,
          active: user.active
        });
      },
      error: (err) => {
        if (err.status === 403) this.error = 'Nemate dozvolu';
        else this.error = 'Greska pri ucitavanju';
      }
    });
  }

  onSubmit(): void {
    this.error = '';
    if (this.form.invalid) return;

    this.saving = true;

    const value = this.form.getRawValue(); // uzima i disabled polja (email), ali ga ne saljemo
    const selectedPerms = this.allPermissions.filter((_, i) => !!this.permissionsArray.value[i]);

    const payload: UpdateUserPayload = {
      firstName: value.firstName!,
      lastName: value.lastName!,
      active: value.active!,
      permissions: selectedPerms as any
    };

    if (value.password && value.password.trim().length > 0) {
      payload.password = value.password.trim();
    }

    this.userApi.update(this.id, payload).subscribe({
      next: () => this.router.navigate(['/users']),
      error: (err) => {
        if (err.status === 403) this.error = 'Nemate dozvolu za izmenu korisnika';
        else this.error = 'Greska pri cuvanju izmena';
      },
      complete: () => this.saving = false
    });
  }
}

