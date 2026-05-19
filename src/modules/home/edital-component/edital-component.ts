import { Component } from '@angular/core';
import {Edital} from '../../../core/models/edital';
import {EditalService} from '../../../core/services/edital-service';
import {UsuarioService} from '../../../core/services/usuario-service';
import {AuthService} from '../../../core/services/auth-service';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatError, MatFormField, MatLabel} from '@angular/material/form-field';
import {MatOption, MatSelect} from '@angular/material/select';
import {MatIcon} from '@angular/material/icon';
import {MatButton} from '@angular/material/button';
import {MatInput} from '@angular/material/input';

@Component({
  selector: 'app-edital-component',
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
  templateUrl: './edital-component.html',
  styleUrl: './edital-component.css',
})
export class EditalComponent {
  errorMessage: string = '';
  successMessage: string = '';
  e: Edital[] = [];
  form: FormGroup;
  isEditando = false;
  formOpen = false;

  constructor(private fb: FormBuilder, private editalService: EditalService, private usuarioService: UsuarioService, private authService: AuthService) {
    this.form = this.fb.group({
      id: [null],
      nome: [null, [Validators.required]],
      observacao: [null]
    })
  }

  ngOnInit() {
    this.isEditando = false
    this.formOpen = false
    this.editalService.getAll().subscribe(
      {
        next: (e) => {
          this.e = e;
        },
        error: (err) => {
          console.error('Erro ao buscar editais: ', err);
        }
      }
    )
  }

  protected excluirEdital(edital: Edital){
    if(confirm("Tem certeza que quer deletar " + edital.nome + "?")){
      this.editalService.delete(edital.id as number).subscribe(
        {
          next: () => {
            this.e = this.e.filter(e => e.id !== edital.id)
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

  protected editandoEdital(edital: Edital){
    this.isEditando = true;
    this.formOpen = true;
    this.form.setValue({
      id: edital.id,
      nome: edital.nome,
      observacao: edital.observacao
    })
  }

  protected atualizarEdital(){
    if(this.form.valid){
      console.log("Entrou em formvalid atualizaredital")
      console.log('dados: ' + JSON.stringify(this.form.value))
      const {id, nome, observacao} = this.form.value;
      this.editalService.update({id, nome, observacao}).subscribe(
        {
          next: (editalAtualizado) => {
            console.log("entrou em subscribe next")
            this.e = this.e.map(edital => edital.id === id ? editalAtualizado : edital);
            this.successMessage = "Sucesso."
            this.ngOnInit();
          },
          error: (err) => {
            this.errorMessage = "Erro. " + JSON.stringify(err.error, ['message']);
            console.error('Erro ao atualizar edital: ', err);
          }
        }
      )
    } else{
      this.errorMessage = "Erro. Cheque validade dos dados."
    }
  }

  adicionarEdital(){
    console.log('validando form adicionaredital');
    console.log('dados: ' + JSON.stringify(this.form.value))
    if (this.form.valid){
      const{id, nome, observacao} = this.form.value;
      this.editalService.create({id, nome, observacao} as Edital).subscribe(
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
