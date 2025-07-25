import { Component } from '@angular/core';
import { DefaultLoginLayoutComponent } from '../../components/default-login-layout/default-login-layout.component';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PrimaryInputComponent } from '../../components/primary-input/primary-input.component';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { PetService } from '../../services/pet.service';

interface PetForm {
  nome: FormControl<string | null>;
  tipoAnimal: FormControl<string | null>;
  raca: FormControl<string | null>;
  idade: FormControl<number | null>;
  porte: FormControl<string | null>;
  cor: FormControl<string | null>;
  descricao: FormControl<string | null>;
  imagens: FormControl<File[] | null>;
}

@Component({
  selector: 'app-cadastro-pet',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DefaultLoginLayoutComponent,
    PrimaryInputComponent
  ],
  templateUrl: './cadastro-pet.component.html',
  styleUrls: ['./cadastro-pet.component.scss']
})
export class CadastroPetComponent {
  petForm: FormGroup<PetForm>;
  previewUrls: (string | ArrayBuffer)[] = [];
  maxImages = 5;

  constructor(
    private router: Router,
    private toastr: ToastrService,
    private petService: PetService
  ) {
    this.petForm = new FormGroup({
      nome: new FormControl('', [Validators.required, Validators.minLength(2)]),
      tipoAnimal: new FormControl('', [Validators.required]),
      raca: new FormControl('', [Validators.required]),
      idade: new FormControl<number | null>(null, [Validators.required, Validators.min(0), Validators.max(30)]),
      porte: new FormControl('', [Validators.required]),
      cor: new FormControl('', [Validators.required]),
      descricao: new FormControl('', [Validators.required, Validators.minLength(20), Validators.maxLength(300)]),
      imagens: new FormControl<File[]>([])
    });
  }

  onFileSelected(event: Event): void {
    const files = (event.target as HTMLInputElement).files;
    if (files) {
      const currentFiles = this.petForm.get('imagens')?.value || [];
      const newFiles = Array.from(files);

      // Verifica o limite de imagens
      if (currentFiles.length + newFiles.length > this.maxImages) {
        this.toastr.warning(`Máximo de ${this.maxImages} fotos permitidas!`);
        return;
      }

      // Verifica o tamanho dos arquivos (máximo 5MB por arquivo)
      const maxSize = 5 * 1024 * 1024; // 5MB
      const oversizedFiles = newFiles.filter(file => file.size > maxSize);
      if (oversizedFiles.length > 0) {
        this.toastr.error('Algumas imagens são muito grandes. Máximo 5MB por foto.');
        return;
      }

      // Atualiza o valor no formulário
      this.petForm.patchValue({ imagens: [...currentFiles, ...newFiles] });
      this.petForm.get('imagens')?.updateValueAndValidity();

      // Gera as URLs para pré-visualização
      newFiles.forEach(file => {
        const reader = new FileReader();
        reader.onload = () => {
          this.previewUrls.push(reader.result as string);
        };
        reader.readAsDataURL(file);
      });

      this.toastr.success(`${newFiles.length} foto(s) adicionada(s)!`);
    }
  }

  removeImage(index: number): void {
    // Remove a URL de pré-visualização
    this.previewUrls.splice(index, 1);

    // Remove o arquivo do FormControl
    const currentFiles = this.petForm.get('imagens')?.value || [];
    currentFiles.splice(index, 1);
    this.petForm.patchValue({ imagens: currentFiles });
    this.petForm.get('imagens')?.updateValueAndValidity();

    this.toastr.info('Foto removida!');
  }

  getDescriptionLength(): number {
    return this.petForm.get('descricao')?.value?.length || 0;
  }

  submit() {
    if (this.petForm.valid) {
      const formData = this.petForm.value;

      // Validações adicionais
      if (!this.previewUrls.length) {
        this.toastr.warning('Adicione pelo menos uma foto do pet!');
        return;
      }

      const petData = {
        name: formData.nome,
        species: formData.tipoAnimal,
        breed: formData.raca,
        age: formData.idade,
        size: formData.porte,
        color: formData.cor,
        description: formData.descricao,
        imageUrls: this.previewUrls.map((url, index) => `pet-image-${Date.now()}-${index}.jpg`)
      };

      this.petService.createPet(petData).subscribe({
        next: () => {
          this.toastr.success('Pet cadastrado com sucesso! 🎉');
          this.router.navigate(['/feed']);
        },
        error: (err) => {
          this.toastr.error('Erro ao cadastrar pet. Tente novamente.');
          console.error('Erro no cadastro do pet:', err);
        }
      });
    } else {
      this.toastr.error('Por favor, preencha todos os campos obrigatórios.');
      this.markFormGroupTouched();
    }
  }

  private markFormGroupTouched(): void {
    Object.keys(this.petForm.controls).forEach(key => {
      const control = this.petForm.get(key);
      control?.markAsTouched();
    });
  }

  navigate() {
    this.router.navigate(['/feed']);
  }
}
