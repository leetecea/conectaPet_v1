import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Pet } from '../../types/pet.type';
import { PetService } from '../../services/pet.service';
import { FavoritesService } from '../../services/favorites.service';
import { HeaderComponent } from '../../components/header/header.component';
import { Subscription, Observable } from 'rxjs';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-pet-details',
  standalone: true,
  imports: [CommonModule, RouterModule, HeaderComponent],
  templateUrl: './pet-details.component.html',
  styleUrls: ['./pet-details.component.scss']
})
export class PetDetailsComponent implements OnInit, OnDestroy {
  pet: Pet | null = null;
  isFavorited: boolean = false;
  isAuthenticated$: Observable<boolean>;
  currentUser$: Observable<any>;
  currentImageIndex = 0;
  private favoriteSub: Subscription | undefined;

  constructor(
    private route: ActivatedRoute,
    private petService: PetService,
    private favoritesService: FavoritesService,
    private authService: AuthService,
    private router: Router
  ) {
    this.isAuthenticated$ = this.authService.isAuthenticated$;
    this.currentUser$ = this.authService.currentUser$;
  }

  ngOnInit(): void {
    const petId = Number(this.route.snapshot.paramMap.get('id'));
    if (petId) {
      this.loadPetDetails(petId);
      // Escuta as mudanças nos favoritos
      this.favoriteSub = this.favoritesService.favorites$.subscribe(favs => {
        this.isFavorited = favs.includes(petId);
      });
    }
  }

  ngOnDestroy(): void {
    // Cancela a inscrição para evitar memory leaks
    if (this.favoriteSub) {
      this.favoriteSub.unsubscribe();
    }
  }

  loadPetDetails(id: number): void {
    this.petService.getPetById(id).subscribe(pet => {
      if (pet) {
        this.pet = pet;
      }
    });
  }

  toggleFavorite(): void {
    if (this.pet) {
      this.favoritesService.toggleFavorite(this.pet.id);
    }
  }

  viewOngProfile(): void {
    if (this.pet?.ownerId) {
      this.router.navigate(['/profile', this.pet.ownerId]);
    }
  }

  nextImage(): void {
    if (this.pet && this.pet.imageUrls.length > 1) {
      this.currentImageIndex = (this.currentImageIndex + 1) % this.pet.imageUrls.length;
    }
  }

  previousImage(): void {
    if (this.pet && this.pet.imageUrls.length > 1) {
      this.currentImageIndex = (this.currentImageIndex - 1 + this.pet.imageUrls.length) % this.pet.imageUrls.length;
    }
  }
}
