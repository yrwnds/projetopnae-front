import { Component } from '@angular/core';
import { FullCalendarModule } from '@fullcalendar/angular';
import {CalendarOptions, EventSourceInput} from '@fullcalendar/core'; // useful for typechecking
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin, { DateClickArg } from '@fullcalendar/interaction';
import {EntregaService} from '../../../core/services/entrega-service';
import {Entrega} from '../../../core/models/entrega';
import moment from 'moment';

@Component({
  selector: 'app-dashboard-component',
  imports: [FullCalendarModule],
  templateUrl: './dashboard-component.html',
  styleUrl: './dashboard-component.css',
})
export class DashboardComponent {

  constructor(private entregaService: EntregaService) {
  }


  e: Entrega[] = [];
  eventos: { start: string; title: string }[] = []


  ngOnInit() {
    this.entregaService.getAll().subscribe(
      {
        next: (e) => {
          this.e = e;
          console.log(this.e)
        },
        error: (err) => {
          console.error('Erro ao buscar entregas: ', err);
        }
      }
    )
    this.eventos = this.e.map(e => ({
      title: e.edital.nome,
      start: moment.utc(e.dataentrega).format("yyyy-mm-dd")
    }))
    console.log(this.eventos)
  }

  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    plugins: [dayGridPlugin, interactionPlugin],
    dateClick: (arg) => this.handleDateClick(arg),
    events: [this.eventos]
  };

  handleDateClick(arg: DateClickArg) {
    alert('date click! ' + arg.dateStr)
  }
}


