import { Component } from '@angular/core';
import { RouterLink, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { MatIcon } from '@angular/material/icon';
import { MaterialModules } from '../../material';
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, MaterialModules, RouterModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  isAuthenticated$: Observable<boolean>;
  userId: number | null = null;

  constructor(private authService: AuthService) {
    this.isAuthenticated$ = this.authService.isAuthenticated$;
  }

   ngOnInit() {
    this.authService.currentUser$.subscribe(user => {
      this.userId = user?.id || null;
    });
  }

  logout(): void {
    this.authService.logout();
  }
}
