import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Usuario} from '../models/usuario';
import {env} from '../../environment/environment.prod';

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {
  constructor(private httpClient: HttpClient){
  }

  getAll(): Observable<Usuario[]>{
    return this.httpClient.get<Usuario[]>(env.apiUrl + '/usuario/listar');
  }

  buscarPorEmail(email: string): Observable<Usuario>{
    return this.httpClient.get<Usuario>(env.apiUrl + '/usuario/email/' + email);
  }

  create(usuario: Usuario): Observable<Usuario> {
    return this.httpClient.post<Usuario>(env.apiUrl + '/usuario', usuario);
  }

  update(usuario: Usuario): Observable<Usuario> {
    return this.httpClient.put<Usuario>(env.apiUrl + '/usuario', usuario);
  }

  delete(id: number): Observable<void> {
    return this.httpClient.delete<void>(env.apiUrl + '/usuario/' + id);
  }
}
