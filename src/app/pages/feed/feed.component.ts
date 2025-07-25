import { Component, OnInit } from '@angular/core';
import { PetService } from '../../services/pet.service';
import { Pet } from '../../types/pet.type';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { PetCardComponent } from '../../components/pet-card/pet-card.component';
import { FavoritesService } from '../../services/favorites.service';
import { Observable } from 'rxjs';
import { HeaderComponent } from '../../components/header/header.component';
import { MaterialModules } from '../../material';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-feed',
  standalone: true,
  imports: [CommonModule, PetCardComponent, HeaderComponent, MaterialModules],
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.scss']
})
export class FeedComponent implements OnInit {
  pets: Pet[] = [];
  showFavorites = false;
  favoritePetIds$: Observable<number[]>;
  isAuthenticated$: Observable<boolean>; // <-- ADICIONE ESTA LINHA
  currentUser$: Observable<any>;

  constructor(
    private petService: PetService,
    private favoritesService: FavoritesService,
    private authService: AuthService,
    private route: ActivatedRoute
  ) {
    this.favoritePetIds$ = this.favoritesService.favorites$;
    this.isAuthenticated$ = this.authService.isAuthenticated$; // <-- ATRIBUA O OBSERVABLE
    this.currentUser$ = this.authService.currentUser$;
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.showFavorites = params['favorites'] === 'true';
      this.loadPets();
    });
  }

  private loadPets(): void {
    if (this.showFavorites) {
      this.favoritesService.favorites$.subscribe(favoriteIds => {
        if (favoriteIds.length > 0) {
          this.petService.getFavoritesPets(favoriteIds).subscribe(data => {
            this.pets = data;
          });
        } else {
          this.pets = [];
        }
      });
    } else {
      this.petService.getAllPets().subscribe(data => {
        this.pets = data;
      });
    }
  }

  onToggleFavorite(petId: number): void {
    this.favoritesService.toggleFavorite(petId);
    
    // Se estamos na página de favoritos, recarrega a lista
    if (this.showFavorites) {
      setTimeout(() => this.loadPets(), 100);
    }
  }

  isPetFavorited(petId: number, favIds: number[] | null): boolean {
    return favIds ? favIds.includes(petId) : false;
  }
}
