import { Component } from '@angular/core';
import { DefaultLoginLayoutComponent } from '../../components/default-login-layout/default-login-layout.component';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PrimaryInputComponent } from '../../components/primary-input/primary-input.component';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { PetService } from '../../services/pet.service';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

interface PetForm {
  nome: FormControl<string | null>;
  tipoAnimal: FormControl<string | null>;
  raca: FormControl<string | null>;
  idade: FormControl<number | null>;
  porte: FormControl<string | null>;
  cor: FormControl<string | null>;
  descricao: FormControl<string | null>;
  imageUrl: FormControl<string | null>;
  imageAlt: FormControl<string | null>;
}

@Component({
  selector: 'app-cadastro-pet',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    DefaultLoginLayoutComponent,
    PrimaryInputComponent
  ],
  templateUrl: './cadastro-pet.component.html',
  styleUrls: ['./cadastro-pet.component.scss']
})
export class CadastroPetComponent {
  petForm: FormGroup<PetForm>;
  previewUrl: string | ArrayBuffer | null = null;
  uploadMethod: 'file' | 'url' = 'file';
  selectedFile: File | null = null;
  imageLoadError = false;
  imageLoaded = false;

  constructor(
    private router: Router,
    private toastr: ToastrService,
    private petService: PetService,
    private authService: AuthService
  ) {
    this.checkUserPermissions();
    
    this.petForm = new FormGroup({
      nome: new FormControl('', [Validators.required, Validators.minLength(2)]),
      tipoAnimal: new FormControl('', [Validators.required]),
      raca: new FormControl('', [Validators.required]),
      idade: new FormControl<number | null>(null, [Validators.required, Validators.min(0), Validators.max(30)]),
      porte: new FormControl('', [Validators.required]),
      cor: new FormControl('', [Validators.required]),
      descricao: new FormControl('', [Validators.required, Validators.minLength(20), Validators.maxLength(300)]),
      imageUrl: new FormControl(''),
      imageAlt: new FormControl('')
    });
  }

  private checkUserPermissions(): void {
    this.authService.currentUser$.subscribe(user => {
      if (user && user.userType !== 'ong') {
        this.toastr.error('Apenas ONGs podem cadastrar pets!');
        this.router.navigate(['/feed']);
      }
    });
  }

  onFileSelected(event: Event): void {
    const files = (event.target as HTMLInputElement).files;
    if (files && files.length > 0) {
      const file = files[0];

      // Verifica o tamanho do arquivo (máximo 5MB)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        this.toastr.error('Imagem muito grande. Máximo 5MB por foto.');
        return;
      }

      // Verifica o tipo do arquivo
      if (!file.type.startsWith('image/')) {
        this.toastr.error('Por favor, selecione apenas arquivos de imagem.');
        return;
      }

      this.selectedFile = file;
      
      // Gera a URL para pré-visualização
      const reader = new FileReader();
      reader.onload = () => {
        this.previewUrl = reader.result;
      };
      reader.readAsDataURL(file);

      this.toastr.success('Foto adicionada com sucesso!');
    }
  }

  removeImage(): void {
    this.previewUrl = null;
    this.selectedFile = null;
    
    // Limpa o input file
    const fileInput = document.getElementById('imagem') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }

    this.toastr.info('Foto removida!');
  }

  onImageError(): void {
    this.imageLoadError = true;
    this.imageLoaded = false;
  }

  onImageLoad(): void {
    this.imageLoadError = false;
    this.imageLoaded = true;
  }

  getDescriptionLength(): number {
    return this.petForm.get('descricao')?.value?.length || 0;
  }

  submit() {
    if (this.petForm.valid) {
      const formData = this.petForm.value;

      // Validação de imagem
      if (this.uploadMethod === 'file' && !this.selectedFile) {
        this.toastr.warning('Adicione uma foto do pet!');
        return;
      }

      if (this.uploadMethod === 'url') {
        if (!formData.imageUrl || !formData.imageAlt) {
          this.toastr.warning('Preencha a URL e descrição da imagem!');
          return;
        }
        if (this.imageLoadError) {
          this.toastr.error('A URL da imagem não é válida!');
          return;
        }
      }

      // Prepara os dados do pet
      let imageUrl = '';
      let imageAlt = '';

      if (this.uploadMethod === 'url') {
        imageUrl = formData.imageUrl || '';
        imageAlt = formData.imageAlt || '';
      } else {
        // Para upload de arquivo, usamos uma URL placeholder
        // Em um cenário real, você faria upload para um serviço de storage
        imageUrl = `https://via.placeholder.com/400x300?text=${encodeURIComponent(formData.nome || 'Pet')}`;
        imageAlt = `Foto de ${formData.nome}`;
      }

      if (!imageUrl) {
        this.toastr.warning('Adicione uma imagem do pet!');
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
        imageUrls: [imageUrl],
        imageAlt: imageAlt
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
