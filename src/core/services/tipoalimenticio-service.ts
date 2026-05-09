import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Tipoalimenticio} from '../models/tipoalimenticio';
import {env} from '../../environment/environment.prod';

@Injectable({
  providedIn: 'root',
})
export class TipoalimenticioService {
  constructor(private httpClient: HttpClient){
  }

  getAll(): Observable<Tipoalimenticio[]>{
    return this.httpClient.get<Tipoalimenticio[]>(env.apiUrl + '/tipoalimenticio/listar');
  }

  buscarPorNome(nome: string): Observable<Tipoalimenticio>{
    return this.httpClient.get<Tipoalimenticio>(env.apiUrl + '/tipoalimenticio/nome/' + nome);
  }

  buscarPorId(id: string): Observable<Tipoalimenticio>{
    return this.httpClient.get<Tipoalimenticio>(env.apiUrl + '/tipoalimenticio/id/' + id);
  }

  create(tipoalimenticio: Tipoalimenticio): Observable<Tipoalimenticio> {
    return this.httpClient.post<Tipoalimenticio>(env.apiUrl + '/tipoalimenticio', tipoalimenticio);
  }

  update(tipoalimenticio: Tipoalimenticio): Observable<Tipoalimenticio> {
    return this.httpClient.put<Tipoalimenticio>(env.apiUrl + '/tipoalimenticio', tipoalimenticio);
  }

  delete(id: number): Observable<void> {
    return this.httpClient.delete<void>(env.apiUrl + '/tipoalimenticio/' + id);
  }
}
