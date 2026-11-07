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

    saveToken(token: string): void {
        localStorage.setItem('token', token);
    }

    getToken(): string | null {
        return localStorage.getItem('token');
    }
}