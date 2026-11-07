import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Auth } from '../../services/auth';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {

  private auth = inject(Auth);
  private router = inject(Router);

  email = '';
  password = '';
  errorMessage = '';

  onSubmit(): void {
    this.errorMessage = '';

    this.auth.login({
      email: this.email,
      password: this.password
    }).subscribe({
      next: (response) => {
        this.auth.saveToken(response.token);
        this.router.navigate(['/dashboard']);
      },
      error: () => {
        this.errorMessage = 'Invalid email or password.';
      }
    });
  }
}