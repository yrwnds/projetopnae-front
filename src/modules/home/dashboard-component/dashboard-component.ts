import { Component } from '@angular/core';
import { FullCalendarModule } from '@fullcalendar/angular';
import {CalendarOptions, EventClickArg, EventSourceInput} from '@fullcalendar/core'; // useful for typechecking
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin, {DateClickArg} from '@fullcalendar/interaction';
import {EntregaService} from '../../../core/services/entrega-service';
import {Entrega} from '../../../core/models/entrega';
import moment from 'moment';
import {UsuarioService} from '../../../core/services/usuario-service';
import {AuthService} from '../../../core/services/auth-service';
import {Produtoentrega} from '../../../core/models/produtoentrega';
import {ProdutoentregaService} from '../../../core/services/produtoentrega-service';

@Component({
  selector: 'app-dashboard-component',
  imports: [FullCalendarModule],
  templateUrl: './dashboard-component.html',
  styleUrl: './dashboard-component.css',
})
export class DashboardComponent {

  constructor(private entregaService: EntregaService, private usuarioService: UsuarioService, private authService: AuthService, private produtoEntregaService : ProdutoentregaService) {
  }

  usuLogado = 0
  e: Entrega[] = [];

  entrega: Entrega = {} as Entrega
  produtos: Produtoentrega[] = []
  openDetalhes = false

  errorMessage = ''
  successMessage = ''

  ngOnInit() {
    this.usuarioService.buscarPorEmail(this.authService.getUserEmail()).subscribe(
      {
        next: (usu) => {
          this.usuLogado = usu.id;
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
              if (e.id === this.usuLogado) {
                return ({
                  id: e.id.toString(),
                  title: e.edital.nome,
                  date: moment.utc(e.dataentrega).format("YYYY-MM-DD")
                })
              } else {
                return ({title: '', date: ''});
              }
            })
          }
        },
        error: (err) => {
          console.error('Erro ao buscar entregas: ', err);
        }
      }
    )
  }

  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    plugins: [dayGridPlugin, interactionPlugin],
    eventClick: (arg) => this.handleEventClick(arg),
    events: []
  };

  handleEventClick(arg: EventClickArg){
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

  clear(){
    this.errorMessage = ''
    this.successMessage = ''
  }

  fechar(){
    this.entrega = {} as Entrega
    this.produtos = []
    this.openDetalhes = false
  }

  protected readonly open = open;
}


