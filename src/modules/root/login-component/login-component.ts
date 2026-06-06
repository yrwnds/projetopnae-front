import { Component } from '@angular/core';
import {MatError, MatFormField, MatLabel, MatSuffix} from '@angular/material/form-field';
import {MatInput} from '@angular/material/input';
import {MatButton} from '@angular/material/button';
import {MatCardActions} from '@angular/material/card';
import {Router, RouterLink} from '@angular/router';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {AuthService} from '../../../core/services/auth-service';
import {NgOptimizedImage} from '@angular/common';
import {MatIcon} from '@angular/material/icon';

@Component({
  selector: 'app-login-component',
  imports: [
    MatFormField,
    MatInput,
    MatButton,
    MatCardActions,
    RouterLink,
    MatLabel,
    ReactiveFormsModule,
    MatError,
    NgOptimizedImage,
    MatIcon,
    MatSuffix
  ],
  templateUrl: './login-component.html',
  styleUrl: './login-component.css',
})
export class LoginComponent {
  form: FormGroup;

  errorMessage = ''

  constructor(private authService: AuthService,
              private fb: FormBuilder,
              private router: Router
  ){
    this.form = this.fb.group({
      email: ['', [Validators.required]],
      senha: ['', [Validators.required]]
    })
  }
  protected onSubmit() {
    if (this.form.valid) {
      const {email, senha} = this.form.value;
      console.log(email, senha);

      this.authService.login(email, senha).subscribe({
        next: (response) => {
          console.log('Login com sucesso');
          this.authService.setToken(response.token);
          this.router.navigate(['/home']);
        },
        error: (err) => {
          console.log('Login falhou ', err);
          this.errorMessage =  "ERRO: Email ou senha incorretos."
        }
      });

      console.log('Declarado após login');

    }
  }

  clear(){
    this.errorMessage = ''
  }
}
