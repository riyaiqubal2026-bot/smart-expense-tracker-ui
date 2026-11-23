import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable } from 'rxjs';
export interface LoginRequest {
    email: string;
    password: string;
}

export interface LoginResponse {
    token: string;
    id: number;
    name: string;
    email: string;
}

export interface RegisterRequest {
    name: string;
    email: string;
    age: number;
    password: string;
}
@Injectable({
    providedIn: 'root'
})
export class Auth {
    private http = inject(HttpClient);

    private apiUrl = 'http://localhost:8082/api/users';

    login(request: LoginRequest): Observable<LoginResponse> {
        return this.http.post<LoginResponse>(
            `${this.apiUrl}/login`,
            request
        );
    }
    register(request: RegisterRequest): Observable<any> {
        return this.http.post(
            `${this.apiUrl}/saveUser`,
            request
        );
    }

    saveToken(token: string): void {
        localStorage.setItem('token', token);
    }

    getToken(): string | null {
        return localStorage.getItem('token');
    }
    logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
}
    saveUser(user: LoginResponse): void {
        localStorage.setItem('user', JSON.stringify(user));
    }

    getUser(): LoginResponse | null {
        const user = localStorage.getItem('user');

        return user ? JSON.parse(user) : null;
    }
    isTokenExpired(): boolean {
  const token = this.getToken();

  if (!token) {
    return true;
  }

  try {
    const payload = JSON.parse(
      atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/'))
    );

    if (!payload.exp) {
      return true;
    }

    return Date.now() >= payload.exp * 1000;

  } catch {
    return true;
  }

}
}