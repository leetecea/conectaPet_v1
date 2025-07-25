import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PetCardComponent } from '../../components/pet-card/pet-card.component';
import { Pet } from '../../types/pet.type';
import { FavoritesService } from '../../services/favorites.service';
import { PetService } from '../../services/pet.service';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { HeaderComponent } from '../../components/header/header.component';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service'; // 1. Importe o AuthService

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [CommonModule, PetCardComponent, HeaderComponent],
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.scss'],
})
export class FavoritesComponent implements OnInit {
  favoritePets$: Observable<Pet[]>;
  favoritePetIds$: Observable<number[]>;
  isAuthenticated$: Observable<boolean>; // 2. Crie a propriedade isAuthenticated$
  currentUser$: Observable<any>;

  constructor(
    private favoritesService: FavoritesService,
    private petService: PetService,
    private router: Router,
    private authService: AuthService // 3. Injete o AuthService
  ) {
    this.favoritePetIds$ = this.favoritesService.favorites$;
    this.isAuthenticated$ = this.authService.isAuthenticated$; // 4. Atribua o observable
    this.currentUser$ = this.authService.currentUser$;
    this.favoritePets$ = this.favoritesService.favorites$.pipe(
      switchMap(ids => {
        if (ids.length === 0) {
          return of([]);
        }
        return this.petService.getFavoritesPets(ids);
      })
    );
  }

  ngOnInit(): void {}

  onToggleFavorite(petId: number): void {
    this.favoritesService.toggleFavorite(petId);
  }

  isPetFavorited(petId: number, favIds: number[] | null): boolean {
    return favIds ? favIds.includes(petId) : false;
  }

  goToFeed(): void {
    this.router.navigate(['/feed']);
  }
}
