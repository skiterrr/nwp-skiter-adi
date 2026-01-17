// import {Component} from '@angular/core';
// import {FormBuilder, Validators} from '@angular/forms';
// import {Router} from '@angular/router';
// import {MachineStoreService} from '../../services/machine-store.service';
// import {AuthService} from '../../services/auth.service';
// import {MachineState} from '../../models/machine';
// import {Permission} from "../../models/permission";
//
// @Component({
//   selector: 'app-machine-create',
//   templateUrl: './machine-create.component.html',
//   styleUrls: ['./machine-create.component.css']
// })
// export class MachineCreateComponent {
//   form = this.fb.group({
//     name: ['', Validators.required]
//   });
//
//   submitting = false;
//   error = '';
//
//   canCreate = false;
//
//   constructor(
//     private fb: FormBuilder,
//     private store: MachineStoreService,
//     private auth: AuthService,
//     private router: Router
//   ) {}
//
//   ngOnInit(){
//     this.canCreate = this.auth.hasPermission(Permission.MACHINE_CREATE);
//   }
//
//   onSubmit() {
//     this.error = '';
//     if (this.form.invalid) return;
//
//     const user = this.auth.currentUser;
//     if (!user) {
//       this.error = 'Morate biti prijavljeni.';
//       return;
//     }
//
//     this.submitting = true;
//
//     try {
//       this.store.create({
//         id: 0,
//         name: this.form.value.name!,
//         ownerUserId: user.id,
//         ownerEmail: user.email,
//         state: MachineState.OFF,
//         createdAt: new Date().toISOString(),
//         active: true
//       });
//
//       this.router.navigate(['/machines']);
//     } catch (e: any) {
//       this.error = e?.message ?? 'Greska pri kreiranju masine.';
//     } finally {
//       this.submitting = false;
//     }
//   }
// }
import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MachineStoreService } from '../../services/machine-store.service';
import { AuthService } from '../../services/auth.service';
import { Permission } from '../../models/permission';

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

  canCreate = false;

  constructor(
    private fb: FormBuilder,
    private store: MachineStoreService,
    private auth: AuthService,
    private router: Router
  ) {
  }

  ngOnInit() {
    this.canCreate = this.auth.hasPermission(Permission.MACHINE_CREATE);
  }

  async onSubmit() {
    this.error = '';
    if (this.form.invalid) return;

    const user = this.auth.currentUser;
    if (!user) {
      this.error = 'Morate biti prijavljeni.';
      return;
    }

    if (!this.canCreate) {
      this.error = 'Nemate dozvolu za pravljenje masine.';
      return;
    }

    this.submitting = true;

    try {
      const name = this.form.value.name!.trim();
      if (!name) {
        this.error = 'Naziv je obavezan.';
        return;
      }


      await this.store.create(name);

      await this.router.navigate(['/machines']);
    } catch (e: any) {
      const status = e?.status;
      if (status === 403) this.error = 'Nemate dozvolu (403).';
      else this.error = e?.error?.message
    }
  }
}
