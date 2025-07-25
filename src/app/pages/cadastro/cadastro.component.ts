import { Component, OnInit } from '@angular/core';
import { MaterialModules } from '../../material';
import { DefaultLoginLayoutComponent } from '../../components/default-login-layout/default-login-layout.component';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PrimaryInputComponent } from '../../components/primary-input/primary-input.component';
import { Router } from '@angular/router';
import { LoginService } from '../../services/login.service';
import { ToastrService } from 'ngx-toastr';
import { MatRadioModule } from '@angular/material/radio';
import { CommonModule } from '@angular/common';

interface CadastroForm {
  userType: FormControl<string | null>;
  name: FormControl<string | null>;
  email: FormControl<string | null>;
  password: FormControl<string | null>;
  passwordConfirm: FormControl<string | null>;
  cnpj: FormControl<string | null>;
  descricao: FormControl<string | null>;
  acceptTerms: FormControl<boolean | null>;
}

@Component({
  selector: 'app-cadastro',
  standalone: true,
  imports: [MaterialModules, ReactiveFormsModule, DefaultLoginLayoutComponent, PrimaryInputComponent, MatRadioModule, CommonModule],
  templateUrl: './cadastro.component.html',
  styleUrl: './cadastro.component.scss',
})
export class CadastroComponent implements OnInit {
  cadastroForm!: FormGroup<CadastroForm>;

  constructor(
    private router: Router,
    private loginService: LoginService,
    private toastService: ToastrService
  ) {
    this.cadastroForm = new FormGroup({
      userType: new FormControl('adotante', [Validators.required]),
      name: new FormControl('', [Validators.required, Validators.minLength(3)]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)]),
      passwordConfirm: new FormControl('', [Validators.required, Validators.minLength(6)]),
      cnpj: new FormControl({ value: '', disabled: true }, [Validators.required, Validators.minLength(14)]),
      descricao: new FormControl({ value: '', disabled: true }, [Validators.required, Validators.maxLength(250)]),
      acceptTerms: new FormControl(false, [Validators.requiredTrue])
    });
  }

  ngOnInit(): void {
    const userTypeControl = this.cadastroForm.get('userType');
    const cnpjControl = this.cadastroForm.get('cnpj');
    const descricaoControl = this.cadastroForm.get('descricao');

    userTypeControl?.valueChanges.subscribe(userType => {
      if (userType === 'ong') {
        cnpjControl?.enable();
        descricaoControl?.enable();
      } else {
        cnpjControl?.disable();
        descricaoControl?.disable();
        cnpjControl?.reset();
        descricaoControl?.reset();
      }
    });
  }

  passwordsMatch(): boolean {
    const password = this.cadastroForm.get('password')?.value;
    const passwordConfirm = this.cadastroForm.get('passwordConfirm')?.value;
    return password === passwordConfirm && password !== '';
  }

  getDescriptionLength(): number {
    return this.cadastroForm.get('descricao')?.value?.length || 0;
  }

  submit() {
    if (this.cadastroForm.valid) {
      if (!this.passwordsMatch()) {
        this.toastService.error('As senhas não coincidem!');
        return;
      }

      const formData = this.cadastroForm.value;
      const registerData = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        userType: formData.userType,
        cnpj: formData.userType === 'ong' ? formData.cnpj : null,
        description: formData.userType === 'ong' ? formData.descricao : null
      };

      this.loginService.register(registerData).subscribe({
        next: () => {
          this.toastService.success('Cadastro realizado com sucesso!');
          this.router.navigate(['feed']);
        },
        error: (err) => {
          this.toastService.error('Erro ao realizar cadastro. Tente novamente.');
          console.error('Erro no cadastro:', err);
        }
      });
    } else {
      this.toastService.error('Por favor, preencha todos os campos obrigatórios!');
    }
  }

  navigate() {
    this.router.navigate(['login']);
  }
}