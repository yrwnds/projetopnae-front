import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {RootComponent} from './root-component';
import {LoginComponent} from './login-component/login-component';
import {CadastroComponent} from './cadastro-component/cadastro-component';
import {RecuperarComponent} from './recuperar-component/recuperar-component';

const routes: Routes = [
  {path: '', component: RootComponent, children: [
      {path: '', redirectTo: 'login', pathMatch: 'full'},
      {path: 'login', component: LoginComponent},
      {path: 'cadastro', component: CadastroComponent},
      {path: 'recuperar', component: RecuperarComponent}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RootRoutingModule { }
