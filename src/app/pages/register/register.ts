
import { Component, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Auth, RegisterRequest } from '../../services/auth';

@Component({
  selector: 'app-register',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register {
  private auth = inject(Auth);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  name = '';
  email = '';
  age: number | null = null;
  password = '';

  errorMessage = '';
  successMessage = '';
  isLoading = false;

  onSubmit(): void {
    this.errorMessage = '';
    this.successMessage = '';

    if (this.age === null || this.age < 18) {
      this.errorMessage = 'You must be at least 18 years old.';
      return;
    }

    this.isLoading = true;

    const request: RegisterRequest = {
      name: this.name,
      email: this.email,
      age: this.age,
      password: this.password
    };

    this.auth.register(request).subscribe({
      next: (response) => {
        console.log('Registration response:', response);

        this.isLoading = false;
        this.successMessage =
          'Registration successful! Please login.';

        this.cdr.detectChanges();
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 1500);
      },
      error: (error) => {
        console.error('Registration error:', error);

        this.isLoading = false;
        this.errorMessage =
          'Registration failed. Please try again.';

        this.cdr.detectChanges();
      }
    });
  }
}
