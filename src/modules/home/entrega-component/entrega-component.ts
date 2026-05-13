import { Component } from '@angular/core';
import {Entrega} from '../../../core/models/entrega';
import {AuthService} from '../../../core/services/auth-service';
import {EntregaService} from '../../../core/services/entrega-service';
import {ProdutoentregaService} from '../../../core/services/produtoentrega-service';
import {Produtoentrega} from '../../../core/models/produtoentrega';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
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
  constructor(private fb: FormBuilder, private agricultorService: AgricultorService, private entregaService: EntregaService, private produtoService: ProdutoentregaService, private authService: AuthService, private tipoAlimenticioService: TipoalimenticioService ) {
    this.formEnt = this.fb.group(
      {
        id: [null],
        data: [null, [Validators.required]],
        edital: [null, [Validators.required]],
        usuario: [null, [Validators.required]]
      }
    )
    this.formProd = this.fb.group({
      id: [null],
      entrega: [null, [Validators.required]],
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

  isAdding: boolean = false;
  isEditandoProduto: boolean = false;

  entregaProd: Entrega | null = null;

  ngOnInit() {
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

  addingProdutos(entregaProd: Entrega){
    this.isAdding = true;
    this.entregaProd = entregaProd;
    console.log("EntregaProd = " + this.entregaProd.id)
  }

  addProduto(){
    console.log('Validando form adicionarproduto...');
    console.log('dados: ' + JSON.stringify(this.formProd.value))
    if(this.formProd.valid){
      const{id, entrega, observacao, qtd, tipound, agricultor, tipo}= this.formProd.value;
      this.produtoService.create({id, entrega, observacao, qtd, tipound, agricultor, tipo} as Produtoentrega).subscribe(
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

  addEntrega(){
    console.log('Validando form adicionarentrega...');
    console.log('dados: ' + JSON.stringify(this.formEnt.value))
    if(this.formEnt.valid){

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
  }

  protected readonly JSON = JSON;
}
