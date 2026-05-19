import { Component } from '@angular/core';
import {MatError, MatFormField, MatLabel} from '@angular/material/form-field';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatInput} from '@angular/material/input';
import {MatButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {MatOption, MatSelect} from '@angular/material/select';
import {AgricultorService} from '../../../core/services/agricultor-service';
import {Agricultor} from '../../../core/models/agricultor';

@Component({
  selector: 'app-agricultor-component',
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
  templateUrl: './agricultor-component.html',
  styleUrl: './agricultor-component.css',
})
export class AgricultorComponent {
  errorMessage: string = '';
  successMessage: string = '';
  a: Agricultor[] = [];
  form: FormGroup;
  isEditando = false;
  formOpen = false;

  constructor(private fb: FormBuilder, private agricultorService: AgricultorService){
    this.form = this.fb.group({
      id: [null],
      nome: [null, [Validators.required]],
      contato: [null]
    })
  }

    ngOnInit() {
      this.isEditando = false
      this.formOpen = false
      this.agricultorService.getAll().subscribe(
        {
          next: (a) => {
            this.a = a;
          },
          error: (err) => {
            console.error('Erro ao buscar editais: ', err);
          }
        }
      )
    }

  protected excluirAgricultor(agricultor: Agricultor){
      if(confirm("Tem certeza que quer deletar " + agricultor.nome + "?")){
        this.agricultorService.delete(agricultor.id as number).subscribe(
          {
            next: () => {
              this.a = this.a.filter(a => a.id !== agricultor.id)
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

  protected editandoAgricultor(agricultor: Agricultor){
      this.isEditando = true;
      this.formOpen = true;
      this.form.setValue({
        id: agricultor.id,
        nome: agricultor.nome,
        contato: agricultor.contato
      })
    }

  protected atualizarAgricultor(){
      if(this.form.valid){
        console.log("Entrou em formvalid atualizaragricultor")
        console.log('dados: ' + JSON.stringify(this.form.value))
        const {id, nome, contato} = this.form.value;
        this.agricultorService.update({id, nome, contato}).subscribe(
          {
            next: (agricultorAtualizado) => {
              console.log("entrou em subscribe next")
              this.a = this.a.map(agricultor => agricultor.id === id ? agricultorAtualizado : agricultor);
              this.successMessage = "Sucesso."
              this.ngOnInit();
            },
            error: (err) => {
              this.errorMessage = "Erro. " + JSON.stringify(err.error, ['message']);
              console.error('Erro ao atualizar agricultor: ', err);
            }
          }
        )
      } else{
        this.errorMessage = "Erro. Cheque validade dos dados."
      }
    }

    adicionarAgricultor(){
      console.log('validando form adicionaragricultor');
      console.log('dados: ' + JSON.stringify(this.form.value))
      if (this.form.valid){
        const{id, nome, contato} = this.form.value;
        this.agricultorService.create({id, nome, contato} as Agricultor).subscribe(
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
