
import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { Auth, UserProfile } from '../../services/auth';
import { Sidebar } from '../../shared/sidebar/sidebar';

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, RouterLinkActive,Sidebar],
  templateUrl: './account.html',
  styleUrl: './account.css'
})
export class Account implements OnInit {

  private auth = inject(Auth);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  profile: UserProfile = {
    id: 0,
    name: '',
    email: '',
    age: 18
  };

  loading = true;
  saving = false;
  isEditing = false;

  successMessage = '';
  errorMessage = '';

  ngOnInit(): void {
    this.loadProfile();
  }

  loadProfile(): void {
    this.loading = true;
    this.errorMessage = '';

    this.auth.getMyProfile().subscribe({
      next: (response) => {
        console.log('Profile response:', response);

        this.profile = { ...response };
        this.loading = false;

        this.cdr.detectChanges();
      },
      error: () => {
        this.errorMessage = 'Unable to load your profile. Please try again.';
        this.loading = false;

        this.cdr.detectChanges();
      }
    });
  }

  enableEditing(): void {
    this.isEditing = true;
    this.successMessage = '';
    this.errorMessage = '';
  }

  cancelEditing(): void {
    this.isEditing = false;
    this.loadProfile();
  }

  saveProfile(): void {
    this.saving = true;
    this.successMessage = '';
    this.errorMessage = '';

    this.auth.updateMyProfile(this.profile).subscribe({
      next: (response) => {
        this.profile = { ...response };
        this.isEditing = false;
        this.saving = false;
        this.successMessage = 'Profile updated successfully!';
      },
      error: (error) => {
        this.saving = false;

        if (error.status === 400) {
          this.errorMessage = 'This email may already be registered or the details are invalid.';
        } else {
          this.errorMessage = 'Unable to update your profile. Please try again.';
        }
      }
    });
  }

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
