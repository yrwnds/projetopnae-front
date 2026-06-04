import {Component} from '@angular/core';
import {FullCalendarModule} from '@fullcalendar/angular';
import {CalendarOptions, EventClickArg, EventSourceInput} from '@fullcalendar/core'; // useful for typechecking
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin, {DateClickArg} from '@fullcalendar/interaction';
import {EntregaService} from '../../../core/services/entrega-service';
import {Entrega} from '../../../core/models/entrega';
import moment, {locales} from 'moment';
import {UsuarioService} from '../../../core/services/usuario-service';
import {AuthService} from '../../../core/services/auth-service';
import {Produtoentrega} from '../../../core/models/produtoentrega';
import {ProdutoentregaService} from '../../../core/services/produtoentrega-service';

import {CanvasJSAngularChartsModule} from '@canvasjs/angular-charts';
import {MatButton} from '@angular/material/button';
import {DatePipe} from '@angular/common';

@Component({
  selector: 'app-dashboard-component',
  imports: [FullCalendarModule, CanvasJSAngularChartsModule, MatButton, DatePipe],
  templateUrl: './dashboard-component.html',
  styleUrl: './dashboard-component.css',
})
export class DashboardComponent {

  constructor(private entregaService: EntregaService, private usuarioService: UsuarioService, private authService: AuthService, private produtoEntregaService: ProdutoentregaService) {
  }

  usuLogado = 0
  usuNome = '';
  e: Entrega[] = [];
  p: Produtoentrega[] = []

  entrega: Entrega = {} as Entrega
  produtos: Produtoentrega[] = []
  openDetalhes = false

  errorMessage = ''
  successMessage = ''
  tempoDiaMsg = ''

  showWelcome = false;

  ngOnInit() {
    this.getTempoDoDia()
    this.usuarioService.buscarPorEmail(this.authService.getUserEmail()).subscribe(
      {
        next: (usu) => {
          this.usuLogado = usu.id;
          this.usuNome = usu.nome;
          this.entregaService.getAll().subscribe(
            {
              next: (e) => {
                let contEntregas = 0;
                for (const ent of e) {
                  if (ent.usuario.id == this.usuLogado){
                    contEntregas = contEntregas + 1;
                  }
                }
                if(contEntregas == 0){
                  this.showWelcome = true;
                }
              }, error: (err) =>{
                console.log("Erro: ", err);
              }
            }
          )
        }
      }
    )
    this.entregaService.getAll().subscribe(
      {
        next: (e) => {
          this.e = e;
          console.log(this.e)
          this.calendarOptions = {
            events: this.e.map((e) => {
              if (e.usuario.id === this.usuLogado) {
                return ({
                  id: e.id.toString(),
                  title: e.edital.nome,
                  date: moment.utc(e.dataentrega).format("YYYY-MM-DD")
                })
              } else {
                return ({title: '', date: ''});
              }
            }
        )
          }
        },
        error: (err) => {
          console.error('Erro ao buscar entregas: ', err);
        }
      }
    )
  }

  clearWelcome() {
    this.showWelcome = false;
  }

  calendarOptions: CalendarOptions = {
    locales: [{code: 'pt-br'}],
    initialView: 'dayGridMonth',
    plugins: [dayGridPlugin, interactionPlugin],
    eventClick: (arg) => this.handleEventClick(arg),
    events: []
  };

  handleEventClick(arg: EventClickArg) {
    this.entregaService.buscarPorId(arg.event.id).subscribe(
      {
        next: (e) => {
          this.entrega = e;
        },
        error: (err) => {
          console.log("Erro ao buscar entrega no calendário: ", err)
          this.errorMessage = "Erro. " + JSON.stringify(err.error, ['message']);
        }
      }
    )
    this.produtoEntregaService.buscarPorIdEntrega(Number(arg.event.id)).subscribe(
      {
        next: (p) => {
          this.produtos = p;
        },
        error: (err) => {
          console.log("Erro ao buscar produtos no calendário: ", err)
          this.errorMessage = "Erro. " + JSON.stringify(err.error, ['message']);
        }
      }
    )
    this.openDetalhes = true
  }

  getTempoDoDia() {
    const now: Date = new Date();
    if (now.getUTCHours() < 12) {
      this.tempoDiaMsg = "Bom dia"
    } else if (now.getUTCHours() > 12 && now.getUTCHours() < 18) {
      this.tempoDiaMsg = "Boa tarde"
    } else {
      this.tempoDiaMsg = "Boa noite"
    }
  }

  clear() {
    this.errorMessage = ''
    this.successMessage = ''
  }

  fechar() {
    this.entrega = {} as Entrega
    this.produtos = []
    this.openDetalhes = false
  }

  protected readonly open = open;
  protected readonly locales = locales;
}


