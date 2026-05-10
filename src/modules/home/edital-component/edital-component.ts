import { Component } from '@angular/core';
import {Edital} from '../../../core/models/edital';
import {EditalService} from '../../../core/services/edital-service';
import {UsuarioService} from '../../../core/services/usuario-service';
import {AuthService} from '../../../core/services/auth-service';

@Component({
  selector: 'app-edital-component',
  imports: [],
  templateUrl: './edital-component.html',
  styleUrl: './edital-component.css',
})
export class EditalComponent {
  errorMessage: string = '';
  successMessage: string = '';
  e: Edital[] = [];

  constructor(private editalService: EditalService, private usuarioService: UsuarioService, private authService: AuthService) {
  }

  ngOnInit() {
    this.editalService.getAll().subscribe(
      {
        next: (e) => {
          this.e = e;
        },
        error: (err) => {
          console.error('Erro ao buscar editais: ', err);
        }
      }
    )
  }
}
