// src/app/services/auth.service.ts
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { User } from '../types/user.type';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/api/users';
  private _isAuthenticated = new BehaviorSubject<boolean>(false);
  public isAuthenticated$ = this._isAuthenticated.asObservable();

  private _currentUser = new BehaviorSubject<User | null>(null);
  public currentUser$ = this._currentUser.asObservable();

  constructor(private router: Router, private http: HttpClient) {
    // Verifica o token no sessionStorage quando o serviço é inicializado
    const token = sessionStorage.getItem('auth-token');
    if (token) {
      this._isAuthenticated.next(true);
      this.loadCurrentUser();
    }
  }

  private getAuthHeaders() {
    const token = sessionStorage.getItem('auth-token');
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
  }

  private loadCurrentUser(): void {
    this.http.get<User>(`${this.apiUrl}/profile`, { headers: this.getAuthHeaders() })
      .subscribe({
        next: (user) => this._currentUser.next(user),
        error: () => {
          this._currentUser.next(null);
          this.logout();
        }
      });
  }

  // Define o estado como "logado"
  login(): void {
    this._isAuthenticated.next(true);
    this.loadCurrentUser();
  }

  // Limpa o estado de "logado"
  logout(): void {
    sessionStorage.removeItem('auth-token');
    sessionStorage.removeItem('username');
    this._isAuthenticated.next(false);
    this._currentUser.next(null);
    this.router.navigate(['/login']);
  }
}
