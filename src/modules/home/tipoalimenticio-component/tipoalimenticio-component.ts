import { Component } from '@angular/core';
import {MatError, MatFormField, MatLabel} from '@angular/material/form-field';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatInput} from '@angular/material/input';
import {MatButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {MatOption, MatSelect} from '@angular/material/select';
import {Tipoalimenticio} from '../../../core/models/tipoalimenticio';
import {TipoalimenticioService} from '../../../core/services/tipoalimenticio-service';
import {UsuarioService} from '../../../core/services/usuario-service';
import {AuthService} from '../../../core/services/auth-service';

@Component({
  selector: 'app-tipoalimenticio-component',
  imports: [
    MatFormField,
    MatLabel,
    ReactiveFormsModule,
    MatInput,
    MatButton,
    MatIcon,
    MatOption,
    MatSelect,
    MatError
  ],
  templateUrl: './tipoalimenticio-component.html',
  styleUrl: './tipoalimenticio-component.css',
})
export class TipoalimenticioComponent {
  errorMessage: string = '';
  successMessage: string = '';
  t: Tipoalimenticio[] = [];
  form: FormGroup;
  isEditando = false;
  formOpen = false;
  usuLogado: number = 0;

  constructor(private fb: FormBuilder, private tipoalimenticioService: TipoalimenticioService, private usuarioService: UsuarioService, private authService: AuthService){
    this.form = this.fb.group({
      id: [null],
      nome: [null, [Validators.required]],
    })
  }

  ngOnInit() {
    this.isEditando = false
    this.form.reset()
    this.formOpen = false
    this.usuarioService.buscarPorEmail(this.authService.getUserEmail()).subscribe(
      {
        next: (usu) => {
          this.usuLogado = usu.id;
        }
      }
    )
    this.tipoalimenticioService.getAll().subscribe(
      {
        next: (t) => {
          this.t = t;
        },
        error: (err) => {
          console.error('Erro ao buscar tipos alimenticios: ', err);
        }
      }
    )
  }

  filterResults(text: string) {
    if(!text || text == ''){
      this.tipoalimenticioService.getAll().subscribe(
        {
          next: (t) => {
            this.t = t;
          },
          error: (err) => {
            console.error('Erro ao buscar tipos alimentícios: ', err)
          }
        }
      )
    }
    this.tipoalimenticioService.buscarPorNome(text).subscribe(
      {
        next: (t) => {
          this.t = t;
        },
        error: (err) => {
          console.error('Erro ao buscar tipos alimentícios: ', err)
        }
      }
    )
  }

  protected excluirTipoalimenticio(tipoalimenticio: Tipoalimenticio){
    if(confirm("Tem certeza que quer deletar " + tipoalimenticio.nome + "?")){
      this.tipoalimenticioService.delete(tipoalimenticio.id as number).subscribe(
        {
          next: () => {
            this.t = this.t.filter(t => t.id !== tipoalimenticio.id)
            this.ngOnInit()
          },
          error: (err) =>{
            this.errorMessage = "Erro. " + JSON.stringify(err.error, ['message']);
            console.error('Erro ao excluir: ', err);
          }
        }
      )
    }

  }

  protected openForm(){
    this.formOpen = true;
  }

  protected editandoTipoalimenticio(tipoalimenticio: Tipoalimenticio){
    this.isEditando = true;
    this.formOpen = true;
    this.form.setValue({
      id: tipoalimenticio.id,
      nome: tipoalimenticio.nome,
    })
  }

  protected atualizarTipoalimenticio(){
    if(this.form.valid){
      console.log("Entrou em formvalid atualizartipoalimenticio")
      console.log('dados: ' + JSON.stringify(this.form.value))
      const {id, nome, usuario} = this.form.value;
      this.tipoalimenticioService.update({id, nome, usuario}).subscribe(
        {
          next: (tipoalimenticioAtualizado) => {
            console.log("entrou em subscribe next")
            this.t = this.t.map(tipoalimenticio => tipoalimenticio.id === id ? tipoalimenticioAtualizado : tipoalimenticio);
            this.successMessage = "Sucesso."
            this.ngOnInit();
          },
          error: (err) => {
            this.errorMessage = "Erro. " + JSON.stringify(err.error, ['message']);
            console.error('Erro ao atualizar tipoalimenticio: ', err);
          }
        }
      )
    } else{
      this.errorMessage = "Erro. Cheque validade dos dados."
    }
  }

  adicionarTipoalimenticio(){
    console.log('validando form adicionartipoalimenticio');
    console.log('dados: ' + JSON.stringify(this.form.value))
    if (this.form.valid){
      const{id, nome, usuario} = this.form.value;
      this.tipoalimenticioService.create({id, nome, usuario} as Tipoalimenticio).subscribe(
        {
          next: () => {
            console.log('Criou com sucesso');
            this.successMessage = "Sucesso."
            this.ngOnInit()
          },
          error: (err) => {
            this.errorMessage = "Erro. " + JSON.stringify(err.error, ['message']);
            console.error('erro ao adicionar livro: ', err);
          }
        }
      )
    } else{
      console.log('Form não valida.')
      this.errorMessage = "Erro. Cheque a validade dos dados."
    }
  }

  resetForm() {
    this.form.reset();
    this.isEditando = false;
    this.formOpen = false;
  }

  clear(){
    this.errorMessage = ''
    this.successMessage = ''
  }

}
