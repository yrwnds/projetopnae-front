import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {EntregaComponent} from './entrega-component/entrega-component';
import {TipoalimenticioComponent} from './tipoalimenticio-component/tipoalimenticio-component';
import {CronogramaComponent} from './cronograma-component/cronograma-component';
import {EditalComponent} from './edital-component/edital-component';
import {AgricultorComponent} from './agricultor-component/agricultor-component';
import {UsuarioComponent} from './usuario-component/usuario-component';
import {DashboardComponent} from './dashboard-component/dashboard-component';
import {HomeComponent} from './home-component';
import {RouterModule, Routes} from '@angular/router';


const routes: Routes = [
  {path: '', component: HomeComponent, children:
      [
        {path: '', redirectTo: 'dashboard', pathMatch: 'full'},
        {path: 'dashboard', component: DashboardComponent},
        {path: 'usuario', component: UsuarioComponent},
        {path: 'agricultor', component: AgricultorComponent},
        {path: 'edital', component: EditalComponent},
        {path: 'cronograma', component: CronogramaComponent},
        {path: 'tipoalimenticio', component: TipoalimenticioComponent},
        {path: 'entrega', component: EntregaComponent},
      ]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
