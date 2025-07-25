// src/app/services/favorites.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FavoritesService {
  private favoritesSubject = new BehaviorSubject<number[]>([]);
  public favorites$ = this.favoritesSubject.asObservable();

  constructor() {
    this.loadFavoritesFromSession(); 
  }

  // Carrega os favoritos do sessionStorage
  private loadFavoritesFromSession(): void {
    const stored = sessionStorage.getItem('favorites'); // MUDANÇA AQUI
    if (stored) {
      this.favoritesSubject.next(JSON.parse(stored));
    }
  }

  // Salva os favoritos no sessionStorage
  private saveFavorites(favorites: number[]): void {
    sessionStorage.setItem('favorites', JSON.stringify(favorites)); // MUDANÇA AQUI
    this.favoritesSubject.next(favorites);
  }

  // Método unificado para adicionar/remover
  toggleFavorite(petId: number): void {
    const current = this.favoritesSubject.value;
    if (current.includes(petId)) {
      // Remove se já existir
      this.saveFavorites(current.filter(id => id !== petId));
    } else {
      // Adiciona se não existir
      this.saveFavorites([...current, petId]);
    }
  }

  isFavorite(petId: number): boolean {
    return this.favoritesSubject.value.includes(petId);
  }

  getFavorites(): number[] {
    return this.favoritesSubject.value;
  }
}
