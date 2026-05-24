import { Component } from '@angular/core';
import {RouterLink, RouterOutlet} from '@angular/router';
import {MatToolbar} from '@angular/material/toolbar';
import {MatButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {AuthService} from '../../core/services/auth-service';
import {MatFormField} from '@angular/material/form-field';
import {MatMenuModule} from '@angular/material/menu';
import {UsuarioService} from '../../core/services/usuario-service';
import moment from 'moment';
import {DatePipe, registerLocaleData} from '@angular/common';
import localePt from '@angular/common/locales/pt';
registerLocaleData(localePt, 'pt');

@Component({
  selector: 'app-home-component',
  imports: [
    RouterOutlet,
    MatToolbar,
    MatButton,
    RouterLink,
    MatIcon,
    MatFormField,
    MatMenuModule,
    DatePipe
  ],
  templateUrl: './home-component.html',
  styleUrl: './home-component.css',
})
export class HomeComponent {
  constructor(private authService: AuthService, private usuarioService: UsuarioService){
  }

  usuNome = '';
  horario = moment.now()

  ngOnInit(){
    this.usuarioService.buscarPorEmail(this.authService.getUserEmail()).subscribe(
      {
        next: (usu) => {
          this.usuNome = usu.nome
        }
      }
    )
  }

  protected logout(){
    this.authService.logout();
  }

  protected getRole(){
    console.log(this.authService.getUserRole());
    return this.authService.getUserRole();
  }

  protected readonly moment = moment;
}
