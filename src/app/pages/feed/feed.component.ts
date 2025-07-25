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

  constructor(
    private petService: PetService,
    private favoritesService: FavoritesService,
    private authService: AuthService,
    private route: ActivatedRoute
  ) {
    this.favoritePetIds$ = this.favoritesService.favorites$;
    this.isAuthenticated$ = this.authService.isAuthenticated$; // <-- ATRIBUA O OBSERVABLE
  }

  ngOnInit(): void {
    this.petService.getAllPets().subscribe(data => {
      this.pets = data;
    });
    this.route.queryParams.subscribe(params => {
      this.showFavorites = params['favorites'] === 'true';
    });
  }

  onToggleFavorite(petId: number): void {
    this.favoritesService.toggleFavorite(petId);
  }

  isPetFavorited(petId: number, favIds: number[] | null): boolean {
    return favIds ? favIds.includes(petId) : false;
  }
}
