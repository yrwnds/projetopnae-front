import {Component} from '@angular/core';
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
import {MatOption, MatSelect, MatSelectModule} from '@angular/material/select';
import {MatIcon} from '@angular/material/icon';
import {MatButton} from '@angular/material/button';
import {MatInput} from '@angular/material/input';
import {NgxMatSelectSearchModule} from 'ngx-mat-select-search';
import {UsuarioService} from '../../../core/services/usuario-service';
import {EditalService} from '../../../core/services/edital-service';
import {Edital} from '../../../core/models/edital';
import {AsyncPipe, DatePipe} from '@angular/common';
import {registerLocaleData} from '@angular/common';
import localePt from '@angular/common/locales/pt';
import moment from 'moment';
import {ReplaySubject, Subject, takeUntil} from 'rxjs';

registerLocaleData(localePt, 'pt');
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';

(<any>pdfMake).addVirtualFileSystem(pdfFonts);

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
    DatePipe,
    AsyncPipe
  ],
  templateUrl: './entrega-component.html',
  styleUrl: './entrega-component.css',
})
export class EntregaComponent {
  constructor(private fb: FormBuilder, private editalService: EditalService, private usuarioService: UsuarioService, private agricultorService: AgricultorService, private entregaService: EntregaService, private produtoService: ProdutoentregaService, private authService: AuthService, private tipoAlimenticioService: TipoalimenticioService) {
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

  allProdutos: Produtoentrega[] = [];

  openFormProd: boolean = false;
  openFormEnt: boolean = false;

  isEditandoEnt: boolean = false;
  isEditandoProd: boolean = false;

  entregaId: number = 0;

  usuLogado: number = 0;

  tipoFiltroCtrl: FormControl<string | null> = new FormControl<string | null>('');
  protected _onDestroy = new Subject<void>();
  tipoFiltrado: ReplaySubject<Tipoalimenticio[]> = new ReplaySubject<Tipoalimenticio[]>(1);


  ngOnInit() {
    this.openFormProd = false;
    this.openFormEnt = false;
    this.formProd.reset();
    this.formEnt.reset();
    this.p = [];
    this.produtoService.getAll().subscribe(
      {
        next: (prod) => {
          this.allProdutos = prod;
        },
        error: (err) => {
          console.error('Erro ao buscar produtos: ', err);
        }
      }
    )
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
    this.tipoFiltroCtrl.valueChanges.pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterTipo();
      })
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

  searchDateBetween(dataStart: string, dataEnd: string) {
    if (dataStart == '' && dataEnd == '') {
      this.entregaService.getAll().subscribe(
        {
          next: (e) => {
            this.e = e;
          },
          error: (err) => {
            console.error('Erro ao buscar entregas', err)
          }
        }
      )
    } else if (dataStart == '' && dataEnd != '') {
      this.entregaService.buscarPorData(dataEnd).subscribe(
        {
          next: (e) => {
            this.e = e;
          },
          error: (err) => {
            console.error('Erro ao buscar entregas data', err)
          }
        }
      )
    } else if (dataEnd == '' && dataStart != '') {
      this.entregaService.buscarPorData(dataStart).subscribe(
        {
          next: (e) => {
            this.e = e;
          },
          error: (err) => {
            console.error('Erro ao buscar entregas databetween', err)
          }
        }
      )
    } else {
      this.entregaService.buscarPorDataBetween(dataStart, dataEnd).subscribe(
        {
          next: (e) => {
            this.e = e;
          },
          error: (err) => {
            console.error('Erro ao buscar entregas databetween', err)
          }
        }
      )
    }
  }


  compararObjetos(o1: any, o2: any): boolean {
    return o1 && o2 ? o1.id === o2.id : o1 === o2;
  }


  buscaProdutosPorId(entrega: Entrega) {
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

  protected excluirEntrega(entrega: Entrega) {
    if (confirm("Tem certeza que quer deletar " + entrega.dataentrega + "?")) {
      this.entregaService.delete(entrega.id as number).subscribe(
        {
          next: () => {
            this.e = this.e.filter(e => e.id !== e.id)
            this.ngOnInit()
          },
          error: (err) => {
            this.errorMessage = "Erro. " + JSON.stringify(err.error, ['message']);
            console.error('Erro ao excluir: ', err);
          }
        }
      )
    }
  }

  protected excluirProduto(produto: Produtoentrega) {
    if (confirm("Tem certeza que quer deletar " + produto.tipo + "?")) {
      this.produtoService.delete(produto.id as number).subscribe(
        {
          next: () => {
            this.p = this.p.filter(p => p.id !== produto.id)
            this.ngOnInit()
          },
          error: (err) => {
            this.errorMessage = "Erro. " + JSON.stringify(err.error, ['message']);
            console.error('Erro ao excluir: ', err);
          }
        }
      )
    }

  }

  editandoProduto(produtoentrega: Produtoentrega) {
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

  atualizarProduto() {
    if (this.formProd.valid) {
      console.log("Entrou em formvalid atualizarprod")
      console.log('dados: ' + JSON.stringify(this.formProd.value))
      const {id, qtd, tipound, observacao, tipo, entrega, agricultor} = this.formProd.value;
      this.produtoService.update({id, qtd, tipound, observacao, tipo, entrega, agricultor}).subscribe(
        {
          next: (prodAtualizado) => {
            console.log("entrou em subscribe next")
            this.p = this.p.map(prod => prod.id === id ? prodAtualizado : prod);
            this.successMessage = "Sucesso."
            this.ngOnInit();
          },
          error: (err) => {
            this.errorMessage = "Erro. " + JSON.stringify(err.error, ['message']);
            console.error('Erro ao atualizar prod: ', err);
          }
        }
      )
    } else {
      this.errorMessage = "Erro. Cheque validade dos dados."
    }
  }

  addingProdutos(entregaId: number) {
    this.openFormProd = true;
    this.formProd.reset()
    this.entregaId = entregaId;
    this.isEditandoProd = false;
    console.log("EntregaProd = " + this.entregaId)
  }

  entOpenForm() {
    this.openFormEnt = true;
  }

  protected editandoEntrega(entrega: Entrega) {
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

  protected atualizarEntrega() {
    if (this.formEnt.valid) {
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
            this.formEnt.reset();
          },
          error: (err) => {
            this.errorMessage = "Erro. " + JSON.stringify(err.error, ['message']);
            console.error('Erro ao atualizar entrega: ', err);
          }
        }
      )
    } else {
      this.errorMessage = "Erro. Cheque validade dos dados."
    }
  }

  addEntrega() {
    console.log('Validando form addentrega')
    console.log('dados:' + JSON.stringify(this.formEnt.value))

    if (this.formEnt.valid) {
      const {id, edital, dataentrega} = this.formEnt.value;

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

  addProduto() {
    console.log('Validando form adicionarproduto...');
    console.log('dados: ' + JSON.stringify(this.formProd.value))
    if (this.formProd.valid) {
      const {id, observacao, qtd, tipound, agricultor, tipo} = this.formProd.value;
      this.produtoService.create({
        id,
        observacao,
        qtd,
        tipound,
        agricultor,
        tipo
      } as Produtoentrega, this.entregaId).subscribe(
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
    } else {
      console.log('Form não valida');
      this.errorMessage = "Erro. Verifique a validade dos dados.";
    }
  }

  clear() {
    this.errorMessage = ''
    this.successMessage = ''
  }

  resetFormProd() {
    this.formProd.reset();
    this.openFormProd = false;
  }

  resetFormEnt() {
    this.formEnt.reset();
    this.openFormEnt = false;
  }


  /*GERADOR DE PDF*/


  private buildTableBody(headers: string[]) {
    const body: any[][] = [];

    body.push(headers.map(header => ({text: header, style: 'tableHeader'})))

    const criadoPorUserProd = this.allProdutos.filter(prod => prod.entrega.usuario.id === this.usuLogado);


    criadoPorUserProd.forEach((row) => {
      let data: string = new Date(row.entrega.dataentrega).toISOString().split('T')[0]
      const dataRow = [
        data,
        row.entrega.edital.nome,
        row.tipo.nome,
        row.qtd,
        row.tipound,
        row.observacao,
        row.agricultor.nome,
      ]
      body.push(dataRow);
    })

    return body;
  }

  getBase64ImageFromURL(url: string) {
    return new Promise((resolve, reject) => {
      var img = new Image();
      img.setAttribute("crossOrigin", "anonymous");

      img.onload = () => {
        var canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;

        var ctx = canvas.getContext("2d");
        if (!ctx) {
          throw new Error('canvas context could not be initialized');
        }
        ctx.drawImage(img, 0, 0);

        var dataURL = canvas.toDataURL("image/png");

        resolve(dataURL);
      };

      img.onerror = error => {
        reject(error);
      };

      img.src = url;
    });
  }

  public async generatePdf(): Promise<void> {
    const headerColuna = ['Data de Entrega', 'Edital', 'Alimento', 'Qt.', 'Und.', 'Observação', 'Agricultor']

    const body = this.buildTableBody(headerColuna);
    const now: string = new Date().toISOString().split('T')[0];

    if (body.length <= 1) {
      alert("Não há itens para exportar.");
      return;
    }

    var docDefinition: any = {
      pageSize: 'A4',
      pageOrientation: 'portrait',
      pageMargins: [40, 60, 40, 60],
      header: function () {
        return {
          columns: [
            {text: 'Controle de Entregas PNAE', alignment: 'left', style: 'headerLeft'},
            {text: `Relatório criado em ${now}`, alignment: 'right', style: 'headerRight'}
          ],
          margin: [40, 20, 40, 0]
        };
      },
      footer: function (currentPage: { toString: () => any; }, pageCount: any) {
        return {
          text: `Pág. ${currentPage.toString()} / ${pageCount}`,
          alignment: 'center',
          style: 'footer'
        };
      },
      content: [
        {
          columns: [
            {
              image: await this.getBase64ImageFromURL("images/pnae_old_lg.png"), height: 50, alignment: 'left'
            },
            {
              text: "Relatório de Entregas PNAE", style: 'titulo', alignment: 'right'
            },
          ]
        },
        {
          style: 'tableExample',
          table: {
            widths: ['*', '*', 100, 20, 20, '*', '*'],
            body: body
          }
        }
      ],
      styles: {
        headerLeft: {fontSize: 9, color: '#95a5a6', bold: true},
        tableHeader: {bold: true, fontSize: 11, fillColor: '#e8e8e8'},
        headerRight: {fontSize: 9, color: '#95a5a6'},
        titulo: {fontSize: 22, bold: true, margin: [0, 0, 0, 5]},
        footer: {fontSize: 9, color: '#7f8c8d'},
        tableExample: {margin: [0, 5, 0, 15]}
      }
    };
    pdfMake.createPdf(docDefinition).download(`relatorio_de_entregas_${now}.pdf`);
  }


  protected readonly JSON = JSON;
}
