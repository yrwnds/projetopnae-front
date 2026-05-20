import { Component } from '@angular/core';
import {MatError, MatFormField, MatLabel} from '@angular/material/form-field';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatInput} from '@angular/material/input';
import {MatButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {MatOption, MatSelect} from '@angular/material/select';
import {CronogramaService} from '../../../core/services/cronograma-service';
import {Tipoalimenticio} from '../../../core/models/tipoalimenticio';
import {Cronograma} from '../../../core/models/cronograma';
import {TipoalimenticioService} from '../../../core/services/tipoalimenticio-service';
import {registerLocaleData} from '@angular/common';
import localePt from '@angular/common/locales/pt';
import {DatePipe} from '@angular/common';
import moment from 'moment/moment';

registerLocaleData(localePt, 'pt');
@Component({
  selector: 'app-cronograma-component',
  imports: [
    MatFormField,
    MatLabel,
    ReactiveFormsModule,
    MatInput,
    MatButton,
    MatIcon,
    MatOption,
    MatSelect,
    MatError,
    DatePipe
  ],
  templateUrl: './cronograma-component.html',
  styleUrl: './cronograma-component.css',
})
export class CronogramaComponent {

  errorMessage: string = '';
  successMessage: string = '';
  c: Cronograma[] = [];
  t: Tipoalimenticio[] = [];
  form: FormGroup;
  isEditando = false;
  formOpen = false;

  constructor(private fb: FormBuilder, private cronogramaService: CronogramaService, private tipoalimenticioService: TipoalimenticioService) {
    this.form = this.fb.group({
      id: [null],
      observacao: [null],
      qtd: [null, [Validators.required]],
      tipound: [null],
      previsaoentrega: [null, [Validators.required]],
      tipo: [null, [Validators.required]]
    })
  }

    ngOnInit() {
      this.isEditando = false
      this.formOpen = false
      this.cronogramaService.getAll().subscribe(
        {
          next: (c) => {
            this.c = c;
          },
          error: (err) => {
            console.error('Erro ao buscar cronogramas: ', err);
          }
        }
      )
      this.tipoalimenticioService.getAll().subscribe(
        {
          next: (t) => {
            this.t = t;
          },
          error: (err) => {
            console.error('Erro ao buscar tipo alimenticios: ', err);
          }
        }
      )
    }

  protected excluircronograma(cronograma: Cronograma){
      if(confirm("Tem certeza que quer deletar " + cronograma.tipo.nome + "?")){
        this.cronogramaService.delete(cronograma.id as number).subscribe(
          {
            next: () => {
              this.c = this.c.filter(c => c.id !== cronograma.id)
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

  protected editandocronograma(cronograma: Cronograma){
      this.isEditando = true;
      this.formOpen = true;
      console.log(JSON.stringify(cronograma))
      this.form.setValue({
        id: cronograma.id,
        qtd: cronograma.qtd,
        tipound:  cronograma.tipound,
        observacao: cronograma.observacao,
        previsaoentrega: moment(cronograma.previsaoentrega).format('YYYY-MM-DD'),
        tipo: cronograma.tipo
      })
    }

  protected atualizarcronograma(){
      if(this.form.valid){
        console.log("Entrou em formvalid atualizarcronograma")
        console.log('dados: ' + JSON.stringify(this.form.value))
        const {id, qtd, tipound, observacao, previsaoentrega, tipo} = this.form.value;
        this.cronogramaService.update({id, qtd, tipound, observacao, previsaoentrega, tipo}).subscribe(
          {
            next: (cronogramaAtualizado) => {
              console.log("entrou em subscribe next")
              this.c = this.c.map(cronograma => cronograma.id === id ? cronogramaAtualizado : cronograma);
              this.successMessage = "Sucesso."
              this.ngOnInit();
            },
            error: (err) => {
              this.errorMessage = "Erro. " + JSON.stringify(err.error, ['message']);
              console.error('Erro ao atualizar cronograma: ', err);
            }
          }
        )
      } else{
        this.errorMessage = "Erro. Cheque validade dos dados."
      }
    }

    adicionarcronograma(){
      console.log('validando form adicionarcronograma');
      console.log('dados: ' + JSON.stringify(this.form.value))
      if (this.form.valid){
        const{id, qtd, tipound, observacao, previsaoentrega, tipo} = this.form.value;
        this.cronogramaService.create({id, qtd, tipound, observacao, previsaoentrega, tipo} as Cronograma).subscribe(
          {
            next: () => {
              console.log('Criou com sucesso');
              this.successMessage = "Sucesso."
              this.ngOnInit()
            },
            error: (err) => {
              this.errorMessage = "Erro. " + JSON.stringify(err.error, ['message']);
              console.error('erro ao adicionar cronograma: ', err);
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
