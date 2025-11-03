import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MachineStoreService } from '../../services/machine-store.service';
import { AuthService } from '../../services/auth.service';
import { MachineState } from '../../models/machine';

@Component({
  selector: 'app-machine-create',
  templateUrl: './machine-create.component.html',
  styleUrls: ['./machine-create.component.css']
})
export class MachineCreateComponent {
  form = this.fb.group({
    name: ['', Validators.required]
  });

  submitting = false;
  error = '';

  constructor(
    private fb: FormBuilder,
    private store: MachineStoreService,
    private auth: AuthService,
    private router: Router
  ) {}

  onSubmit() {
    this.error = '';
    if (this.form.invalid) return;

    const user = this.auth.currentUser;
    if (!user) {
      this.error = 'Morate biti prijavljeni.';
      return;
    }

    this.submitting = true;

    try {
      this.store.create({
        id: 0,
        name: this.form.value.name!,
        ownerUserId: user.id,
        ownerEmail: user.email,
        state: MachineState.OFF,
        createdAt: new Date().toISOString(),
        active: true
      });

      this.router.navigate(['/machines']);
    } catch (e: any) {
      this.error = e?.message ?? 'Greška pri kreiranju mašine.';
    } finally {
      this.submitting = false;
    }
  }
}
