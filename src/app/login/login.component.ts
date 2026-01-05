import { Component } from '@angular/core';
import {FormBuilder, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {AuthService} from "../services/auth.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  error = '';

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) {}

  onSubmit() {
    this.error = '';
    if (this.form.invalid) return;

    const { email, password } = this.form.value;

    this.auth.login(email!, password!).subscribe({
      next: () => {
        this.auth.loadMe().subscribe({
          next: () => this.router.navigate(['/users']),
          error: () => this.router.navigate(['/users'])
        });
      },
      error: (err) => {
        if (err?.status === 401) {
          this.error = 'Pogresan email ili lozinka';
        } else if (err?.status === 403) {
          this.error = 'Nalog nije aktivan';
        } else {
          this.error = 'Greska na serveru. Pokusaj ponovo.';
        }
      }
    });
  }
}
