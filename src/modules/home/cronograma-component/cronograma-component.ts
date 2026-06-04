import {Component} from '@angular/core';
import {MatError, MatFormField, MatLabel} from '@angular/material/form-field';
import {FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatInput} from '@angular/material/input';
import {MatButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {MatOption, MatSelect} from '@angular/material/select';
import {CronogramaService} from '../../../core/services/cronograma-service';
import {Tipoalimenticio} from '../../../core/models/tipoalimenticio';
import {Cronograma} from '../../../core/models/cronograma';
import {TipoalimenticioService} from '../../../core/services/tipoalimenticio-service';
import {AsyncPipe, registerLocaleData} from '@angular/common';
import localePt from '@angular/common/locales/pt';
import {DatePipe} from '@angular/common';
import moment from 'moment/moment';
import {ReplaySubject, Subject, takeUntil} from 'rxjs';
import {NgxMatSelectSearchModule} from 'ngx-mat-select-search';
import {UsuarioService} from '../../../core/services/usuario-service';
import {AuthService} from '../../../core/services/auth-service';

registerLocaleData(localePt, 'pt');

interface CronoAgrupado {
  monthYear: string;
  items: Cronograma[];
}

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
    DatePipe,
    AsyncPipe,
    NgxMatSelectSearchModule
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
  usuLogado: number = 0;


  cronoAgrupado: CronoAgrupado[] = [];


  constructor(private fb: FormBuilder, private cronogramaService: CronogramaService, private tipoalimenticioService: TipoalimenticioService, private usuarioService: UsuarioService, private authService: AuthService) {
    this.form = this.fb.group({
      id: [null],
      observacao: [null],
      qtd: [null, [Validators.required]],
      tipound: [null, [Validators.required]],
      previsaoentrega: [null, [Validators.required]],
      tipo: [null, [Validators.required]],
    })
  }

  tipoFiltroCtrl: FormControl<string | null> = new FormControl<string | null>('');
  protected _onDestroy = new Subject<void>();
  tipoFiltrado: ReplaySubject<Tipoalimenticio[]> = new ReplaySubject<Tipoalimenticio[]>(1);

  ngOnInit() {
    this.isEditando = false
    this.formOpen = false
    this.form.reset()
    this.usuarioService.buscarPorEmail(this.authService.getUserEmail()).subscribe(
      {
        next: (usu) => {
          this.usuLogado = usu.id;
        }
      }
    )
    this.cronogramaService.getAll().subscribe(
      {
        next: (c) => {
          this.c = c;
          this.cronoAgrupado = this.agruparCronogramaPorMesAno(this.c);
          console.log(this.cronoAgrupado)
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
    this.tipoFiltroCtrl.valueChanges.pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterTipo();
      })
  }

  agruparCronogramaPorMesAno(items: Cronograma[]) {
      const sorted = [...items].sort((a, b) => new Date(b.previsaoentrega).getTime() - new Date(b.previsaoentrega).getTime());

      const groupsMap = sorted.reduce((acc, item) => {
        const monthYearStr = item.previsaoentrega.toLocaleString('default', {month: 'long'})

        if(!acc[monthYearStr]){
          acc[monthYearStr] = [];
        }
        acc[monthYearStr].push(item);
        return acc;
      }, {} as Record<string, Cronograma[]>);

      return Object.keys(groupsMap).map(key => ({
        monthYear: key,
        items: groupsMap[key]
      }))
  }

  filterResults(text: string) {
    if (!text || text == '') {
      this.cronogramaService.getAll().subscribe(
        {
          next: (c) => {
            this.c = c;
          },
          error: (err) => {
            console.error('Erro ao buscar cronogramas: ', err)
          }
        }
      )
    }
    this.cronogramaService.buscarPorAny(text).subscribe(
      {
        next: (c) => {
          this.c = c;
        },
        error: (err) => {
          console.error('Erro ao buscar cronogramas: ', err)
        }
      }
    )
  }


  protected filterTipo() {
    let search = this.tipoFiltroCtrl.value;
    if (!search) {
      this.tipoFiltrado.next(this.t.slice())
    } else {
      search = search!.toLowerCase()
    }
    if (typeof search === "string") {
      this.tipoFiltrado.next(
        this.t.filter(tipo => tipo.nome.toLowerCase().indexOf(search) > -1)
      )
    }
  }

  protected excluircronograma(cronograma: Cronograma) {
    if (confirm("Tem certeza que quer deletar " + cronograma.tipo.nome + "?")) {
      this.cronogramaService.delete(cronograma.id as number).subscribe(
        {
          next: () => {
            this.c = this.c.filter(c => c.id !== cronograma.id)
          },
          error: (err) => {
            this.errorMessage = "Erro. " + JSON.stringify(err.error, ['message']);
            console.error('Erro ao excluir: ', err);
          }
        }
      )
    }

  }

  compararObjetos(o1: any, o2: any): boolean {
    return o1 && o2 ? o1.id === o2.id : o1 === o2;
  }

  protected openForm() {
    this.formOpen = true;
  }

  protected editandocronograma(cronograma: Cronograma) {
    this.isEditando = true;
    this.formOpen = true;
    console.log(JSON.stringify(cronograma))
    this.form.setValue({
      id: cronograma.id,
      qtd: cronograma.qtd,
      tipound: cronograma.tipound,
      observacao: cronograma.observacao,
      previsaoentrega: moment.utc(cronograma.previsaoentrega).format('YYYY-MM-DD'),
      tipo: cronograma.tipo
    })
  }

  protected atualizarcronograma() {
    if (this.form.valid) {
      console.log("Entrou em formvalid atualizarcronograma")
      console.log('dados: ' + JSON.stringify(this.form.value))
      const {id, qtd, tipound, observacao, previsaoentrega, tipo, usuario} = this.form.value;
      this.cronogramaService.update({id, qtd, tipound, observacao, previsaoentrega, tipo, usuario}).subscribe(
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
    } else {
      this.errorMessage = "Erro. Cheque validade dos dados."
    }
  }

  adicionarcronograma() {
    console.log('validando form adicionarcronograma');
    console.log('dados: ' + JSON.stringify(this.form.value))
    if (this.form.valid) {
      const {id, qtd, tipound, observacao, previsaoentrega, tipo} = this.form.value;
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
    } else {
      console.log('Form não valida.')
      this.errorMessage = "Erro. Cheque a validade dos dados."
    }
  }

  resetForm() {
    this.form.reset();
    this.isEditando = false;
    this.formOpen = false;
  }

  clear() {
    this.errorMessage = ''
    this.successMessage = ''
  }

}
