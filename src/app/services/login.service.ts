// src/app/services/login.service.ts
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tap } from 'rxjs';
import { LoginResponse } from '../types/login-response.type';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private apiUrl: string = "http://localhost:8080/auth";

  constructor(
    private httpClient: HttpClient,
    private authService: AuthService
  ) { }

  login(email: string, senha: string){
    return this.httpClient.post<LoginResponse>(`${this.apiUrl}/login`, { email, password: senha }).pipe(
      tap((value) => {
        sessionStorage.setItem("auth-token", value.token)
        sessionStorage.setItem("username", value.name)
        this.authService.login(); // 3. Notifique o AuthService sobre o login
      })
    )
  }

  register(userData: any) {
    return this.httpClient.post<LoginResponse>(`${this.apiUrl}/register`, userData).pipe(
      tap((value) => {
        sessionStorage.setItem("auth-token", value.token)
        sessionStorage.setItem("username", value.name)
        this.authService.login(); // 4. Notifique o AuthService sobre o registro
      })
    )
  }
}
