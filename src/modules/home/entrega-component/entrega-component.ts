import { Component } from '@angular/core';
import {Entrega} from '../../../core/models/entrega';
import {AuthService} from '../../../core/services/auth-service';
import {EntregaService} from '../../../core/services/entrega-service';
import {ProdutoentregaService} from '../../../core/services/produtoentrega-service';
import {Produtoentrega} from '../../../core/models/produtoentrega';
import {FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {Tipoalimenticio} from '../../../core/models/tipoalimenticio';
import {TipoalimenticioService} from '../../../core/services/tipoalimenticio-service';
import {AgricultorService} from '../../../core/services/agricultor-service';
import {Agricultor} from '../../../core/models/agricultor';
import {MatError, MatFormField, MatLabel} from '@angular/material/form-field';
import {MatOption, MatSelect, MatSelectModule } from '@angular/material/select';
import {MatIcon} from '@angular/material/icon';
import {MatButton} from '@angular/material/button';
import {MatInput} from '@angular/material/input';
import {NgxMatSelectSearchModule} from 'ngx-mat-select-search';
import {UsuarioService} from '../../../core/services/usuario-service';
import {EditalService} from '../../../core/services/edital-service';
import {Edital} from '../../../core/models/edital';

@Component({
  selector: 'app-entrega-component',
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
    NgxMatSelectSearchModule,
    MatSelectModule
  ],
  templateUrl: './entrega-component.html',
  styleUrl: './entrega-component.css',
})
export class EntregaComponent {
  constructor(private fb: FormBuilder, private editalService: EditalService, private usuarioService: UsuarioService, private agricultorService: AgricultorService, private entregaService: EntregaService, private produtoService: ProdutoentregaService, private authService: AuthService, private tipoAlimenticioService: TipoalimenticioService ) {
    this.formEnt = this.fb.group(
      {
        id: [null],
        dataentrega: [null, [Validators.required]],
        edital: [null, [Validators.required]],
        usuario: [null]
      }
    )
    this.formProd = this.fb.group({
      id: [null],
      entrega: [null],
      observacao: [null],
      qtd: [null, [Validators.required]],
      tipound: [null],
      agricultor: [null],
      tipo: [null, [Validators.required]]
    }
    )
  }
  formProd: FormGroup;
  formEnt: FormGroup;

  errorMessage: string = '';
  successMessage: string = '';

  e: Entrega[] = [];
  p: Produtoentrega[] = [];
  t: Tipoalimenticio[] = [];
  a: Agricultor[] = [];
  ed: Edital[] = [];

  isAdding: boolean = false;
  isEditandoProduto: boolean = false;
  isAddingEnt: boolean = false;

  entregaId: number = 0;

  usuLogado: number = 0;

  ngOnInit() {
    this.usuarioService.buscarPorEmail(this.authService.getUserEmail()).subscribe(
      {
        next: (usu) => {
          this.usuLogado = usu.id;
        }
      }
    )
    this.editalService.getAll().subscribe(
      {
        next: (ed) => {
          this.ed = ed;
        },
        error: (err) => {
          console.error('Erro ao buscar editais: ', err);
        }
      }
    );
    this.entregaService.getAll().subscribe(
      {
        next: (e) => {
          this.e = e;
        },
        error: (err) => {
          console.error('Erro ao buscar entregas: ', err);
        }
      }
    )
    this.tipoAlimenticioService.getAll().subscribe(
      {
        next: (t) => {
          this.t = t;
        },
        error: (err) => {
          console.error('Erro ao buscar tipo alimenticios: ', err);
        }
      }
    )
    this.agricultorService.getAll().subscribe(
      {
        next: (a) => {
          this.a = a;
        },
        error: (err) => {
          console.error('Erro ao buscar agricultor: ', err);
        }
      }
    )
  }

  buscaProdutosPorId(entrega: Entrega){
      this.produtoService.buscarPorIdEntrega(entrega.id).subscribe(
        {
          next: (p) => {
            this.p = p;
        },
        error: (err) => {
          console.error('Erro ao buscar produtoentregas', err);
    }
    }
      )
  }

  atualizarProduto(produtoentrega: Produtoentrega){
    this.isEditandoProduto = true;

    this.formProd.setValue({
      id: produtoentrega.id,
      entrega: produtoentrega.entrega,
      observacao: produtoentrega.observacao,
      qtd: produtoentrega.qtd,
      tipound: produtoentrega.tipound,
      agricultor: produtoentrega.agricultor,
      tipo: produtoentrega.tipo
    })
  }

  addingProdutos(entregaId: number){
    this.isAdding = true;
    this.entregaId = entregaId;
    console.log("EntregaProd = " + this.entregaId)
  }

  addingEntregas(){
    this.isAddingEnt = true;
  }

  addEntrega(){
    console.log('Validando form addentrega')
    console.log('dados:' + JSON.stringify(this.formEnt.value))

    if(this.formEnt.valid){
      const{id, edital, dataentrega} = this.formEnt.value;

      this.entregaService.create({id, edital, dataentrega} as Entrega).subscribe(
        {
          next: () => {
            console.log('Criou com sucesso.');
            this.successMessage = 'Sucesso.';
            this.ngOnInit();
          },
          error: (err) => {
            this.errorMessage = "Erro. " + JSON.stringify(err.error, ['message']);
            console.error('Erro: ', err);
          }
        }
      )
    }
  }

  addProduto(){
    console.log('Validando form adicionarproduto...');
    console.log('dados: ' + JSON.stringify(this.formProd.value))
    if(this.formProd.valid){
      const{id, observacao, qtd, tipound, agricultor, tipo}= this.formProd.value;
      this.produtoService.create({id, observacao, qtd, tipound, agricultor, tipo} as Produtoentrega, this.entregaId).subscribe(
        {
          next: () => {
            console.log('Criou com sucesso.');
            this.successMessage = "Sucesso."
            this.ngOnInit()
          },
          error: (err) => {
            this.errorMessage = "Erro. " + JSON.stringify(err.error, ['message']);
            console.error('Erro: ', err);
          }
        }
      )
    } else{
      console.log('Form não valida');
      this.errorMessage = "Erro. Verifique a validade dos dados.";
    }
  }

  clear(){
    this.errorMessage = ''
    this.successMessage = ''
  }

  resetFormProd() {
    this.formProd.reset();
    this.isAdding = false;
  }

  resetFormEnt(){
    this.formEnt.reset();
    this.isAddingEnt = false;
  }

  // ngx-mat-select-search



  protected readonly JSON = JSON;
}
