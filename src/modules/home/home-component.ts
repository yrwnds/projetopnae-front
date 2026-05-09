import { Component } from '@angular/core';
import {RouterLink, RouterOutlet} from '@angular/router';
import {MatToolbar} from '@angular/material/toolbar';
import {MatButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {AuthService} from '../../core/services/auth-service';
import {MatFormField} from '@angular/material/form-field';
import {MatMenuModule} from '@angular/material/menu';

@Component({
  selector: 'app-home-component',
  imports: [
    RouterOutlet,
    MatToolbar,
    MatButton,
    RouterLink,
    MatIcon,
    MatFormField,
    MatMenuModule
  ],
  templateUrl: './home-component.html',
  styleUrl: './home-component.css',
})
export class HomeComponent {
  constructor(private authService: AuthService){
  }

  protected logout(){
    this.authService.logout();
  }

  protected getRole(){
    console.log(this.authService.getUserRole());
    return this.authService.getUserRole();
  }
}
