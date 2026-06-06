import {Component, ErrorHandler} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatError, MatFormField, MatLabel, MatSuffix} from '@angular/material/form-field';
import {Router, RouterLink} from '@angular/router';
import {MatCardActions} from '@angular/material/card';
import {MatButton} from '@angular/material/button';
import {MatInput} from '@angular/material/input';
import {Usuario} from '../../../core/models/usuario';
import {UsuarioService} from '../../../core/services/usuario-service';
import {MatIcon} from '@angular/material/icon';
import {NgOptimizedImage} from '@angular/common';

@Component({
  selector: 'app-cadastro-component',
  imports: [
    MatFormField,
    MatInput,
    MatButton,
    MatCardActions,
    RouterLink,
    MatLabel,
    ReactiveFormsModule,
    MatError,
    MatIcon,
    MatSuffix,
    NgOptimizedImage
  ],
  templateUrl: './cadastro-component.html',
  styleUrl: './cadastro-component.css',
})

export class CadastroComponent {
  form: FormGroup;
  errorMessage = ''

  constructor(private fb: FormBuilder, private usuarioService : UsuarioService, private router: Router){
    this.form = this.fb.group(
      {
        nome: [null, [Validators.required]],
        email: [null, [Validators.required, Validators.email]],
        senha: [null, [Validators.required]]
      }
    )
  }


  adicionarUsuario(){
    console.log('Validando form...');
    if (this.form.valid){
      const {nome, email, senha} = this.form.value;
      this.usuarioService.create({nome, email, senha} as Usuario).subscribe(
        {
          next: () => {
            console.log('Criou com sucesso.');
            this.router.navigate(['/login']);
          },
          error: (err) => {
            console.error('Erro ao adicionar usuario: ', err);

            this.errorMessage = 'Erro: '+ err.message + ' '+ JSON.stringify(err.error, ['message']);
          }
        }
      )
    } else{
      console.log('Form não valida');
      this.errorMessage = "Ocorreu um problema. Cheque a validade dos dados."
    }
  }

  clear(){
    this.errorMessage = ''
  }
}
