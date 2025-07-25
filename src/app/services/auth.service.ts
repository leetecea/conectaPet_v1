// src/app/services/auth.service.ts
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { User } from '../types/user.type';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private _isAuthenticated = new BehaviorSubject<boolean>(false);
  public isAuthenticated$ = this._isAuthenticated.asObservable();

  private _currentUser = new BehaviorSubject<User | null>(null);
  public currentUser$ = this._currentUser.asObservable();

  constructor(private router: Router) {
    // Verifica o token no sessionStorage quando o serviço é inicializado
    const token = sessionStorage.getItem('auth-token');
    this._isAuthenticated.next(!!token);
  }

  // Define o estado como "logado"
  login(): void {
    this._isAuthenticated.next(true);
  }

  // Limpa o estado de "logado"
  logout(): void {
    sessionStorage.removeItem('auth-token');
    sessionStorage.removeItem('username');
    this._isAuthenticated.next(false);
    this.router.navigate(['/login']);
  }
}
