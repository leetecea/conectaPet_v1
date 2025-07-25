import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Pet } from '../../types/pet.type';
import { Router } from '@angular/router';

@Component({
  selector: 'app-pet-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pet-card.component.html',
  styleUrls: ['./pet-card.component.scss']
})
export class PetCardComponent {
  @Input() pet!: Pet;
  @Input() isFavorited: boolean = false;
  @Input() isAuthenticated: boolean = false; 
  @Output() toggleFavorite = new EventEmitter<number>();

  constructor(private router: Router) {}

  onViewDetails(): void {
    this.router.navigate(['/pet', this.pet.id]);
  }

  onToggleFavorite(event: MouseEvent): void {
    event.stopPropagation();
    this.toggleFavorite.emit(this.pet.id);
  }
}
