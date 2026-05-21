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
import {DatePipe} from '@angular/common';
import {registerLocaleData} from '@angular/common';
import localePt from '@angular/common/locales/pt';
import moment from 'moment';
registerLocaleData(localePt, 'pt');

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
    MatSelectModule,
    DatePipe
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

  openFormProd: boolean = false;
  openFormEnt: boolean = false;

  isEditandoEnt: boolean = false;
  isEditandoProd: boolean = false;

  entregaId: number = 0;

  usuLogado: number = 0;

  ngOnInit() {
    this.openFormProd = false;
    this.openFormEnt = false;
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

  protected excluirEntrega(entrega: Entrega){
    if(confirm("Tem certeza que quer deletar " + entrega.dataentrega + "?")){
      this.entregaService.delete(entrega.id as number).subscribe(
        {
          next: () => {
            this.e = this.e.filter(e => e.id !== e.id)
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

  protected excluirProduto(produto: Produtoentrega){
    if(confirm("Tem certeza que quer deletar " + produto.tipo + "?")){
      this.produtoService.delete(produto.id as number).subscribe(
        {
          next: () => {
            this.p = this.p.filter(p => p.id !== produto.id)
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

  editandoProduto(produtoentrega: Produtoentrega){
    this.isEditandoProd = true;
    this.openFormProd = true;
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

  atualizarProduto(){
    if(this.formProd.valid){
      console.log("Entrou em formvalid atualizarprod")
      console.log('dados: ' + JSON.stringify(this.formProd.value))
      const {id, qtd, tipound, observacao, tipo, entrega, agricultor} = this.formProd.value;
      this.produtoService.update({id, qtd, tipound, observacao, tipo, entrega, agricultor}).subscribe(
        {
          next: (prodAtualizado) => {
            console.log("entrou em subscribe next")
            this.p = this.p.map(prod => prod.id === id ? prodAtualizado : entrega);
            this.successMessage = "Sucesso."
            this.ngOnInit();
          },
          error: (err) => {
            this.errorMessage = "Erro. " + JSON.stringify(err.error, ['message']);
            console.error('Erro ao atualizar prod: ', err);
          }
        }
      )
    } else{
      this.errorMessage = "Erro. Cheque validade dos dados."
    }
  }

  addingProdutos(entregaId: number){
    this.openFormProd = true;
    this.formProd.reset()
    this.entregaId = entregaId;
    this.isEditandoProd = false;
    console.log("EntregaProd = " + this.entregaId)
  }

  entOpenForm(){
    this.openFormEnt = true;
  }

  protected editandoEntrega(entrega: Entrega){
    this.openFormEnt = true;
    this.isEditandoEnt = true;
    console.log(JSON.stringify(entrega))
    this.formEnt.setValue({
      id: entrega.id,
      dataentrega: moment.utc(entrega.dataentrega).format('YYYY-MM-DD'),
      edital: entrega.edital,
      usuario: entrega.usuario
    })
  }

  protected atualizarEntrega(){
    if(this.formEnt.valid){
      console.log("Entrou em formvalid atualizarentrega")
      console.log('dados: ' + JSON.stringify(this.formEnt.value))
      const {id, dataentrega, edital, usuario} = this.formEnt.value;
      this.entregaService.update({id, dataentrega, edital, usuario}).subscribe(
        {
          next: (entregaAtualizado) => {
            console.log("entrou em subscribe next")
            this.e = this.e.map(entrega => entrega.id === id ? entregaAtualizado : entrega);
            this.successMessage = "Sucesso."
            this.ngOnInit();
          },
          error: (err) => {
            this.errorMessage = "Erro. " + JSON.stringify(err.error, ['message']);
            console.error('Erro ao atualizar entrega: ', err);
          }
        }
      )
    } else{
      this.errorMessage = "Erro. Cheque validade dos dados."
    }
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
    this.openFormProd = false;
  }

  resetFormEnt(){
    this.formEnt.reset();
    this.openFormEnt = false;
  }

  // ngx-mat-select-search



  protected readonly JSON = JSON;
}
