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
    const success = this.auth.login(email!, password!);

    if (success) {
      this.router.navigate(['/users']);
      this.error = 'Uspeo'
    } else {
      this.error = 'Pogresan email ili lozinka';
    }
  }
}
