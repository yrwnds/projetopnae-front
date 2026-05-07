import { Component, signal } from '@angular/core';
import {Router, RouterOutlet} from '@angular/router';
import {AuthService} from '../core/services/auth-service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  constructor(private authService: AuthService, private router: Router){
    if(this.authService.isLogged()){
      this.router.navigate(['/home'])
    }
  }
}
