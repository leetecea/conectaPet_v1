import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from '../../components/header/header.component';
import { PetCardComponent } from '../../components/pet-card/pet-card.component';
import { MaterialModules } from '../../material';
import { Pet } from '../../types/pet.type';
import { PetService } from '../../services/pet.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-meus-pets',
  standalone: true,
  imports: [CommonModule, RouterModule, HeaderComponent, PetCardComponent, MaterialModules],
  templateUrl: './meus-pets.component.html',
  styleUrls: ['./meus-pets.component.scss']
})
export class MeusPetsComponent implements OnInit {
  pets: Pet[] = [];

  constructor(
    private petService: PetService,
    private toastr: ToastrService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadMyPets();
  }

  private loadMyPets(): void {
    this.petService.getMyPets().subscribe({
      next: (pets) => {
        this.pets = pets;
      },
      error: (err) => {
        this.toastr.error('Erro ao carregar seus pets');
        console.error('Erro ao carregar pets:', err);
      }
    });
  }

  editPet(petId: number): void {
    this.router.navigate(['/editar-pet', petId]);
  }

  deletePet(petId: number): void {
    if (confirm('Tem certeza que deseja excluir este pet?')) {
      this.petService.deletePet(petId).subscribe({
        next: () => {
          this.toastr.success('Pet excluído com sucesso!');
          this.loadMyPets(); // Recarrega a lista
        },
        error: (err) => {
          this.toastr.error('Erro ao excluir pet');
          console.error('Erro ao excluir pet:', err);
        }
      });
    }
  }
}