import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Entrega} from '../models/entrega';
import {env} from '../../environment/environment.prod';

@Injectable({
  providedIn: 'root',
})
export class EntregaService {
  constructor(private httpClient: HttpClient){
  }

  create(entrega: Entrega): Observable<Entrega> {
    return this.httpClient.post<Entrega>(env.apiUrl + '/entrega', entrega);
  }

  getAll(): Observable<Entrega[]>{
    return this.httpClient.get<Entrega[]>(env.apiUrl + '/entrega/listar');
  }

  getDataAsc(): Observable<Entrega[]>{
    return this.httpClient.get<Entrega[]>(env.apiUrl + '/entrega/listar/data/asc');
  }

  getDataDesc(): Observable<Entrega[]>{
    return this.httpClient.get<Entrega[]>(env.apiUrl + '/entrega/listar/data/desc');
  }

  buscarPorId(id: string): Observable<Entrega>{
    return this.httpClient.get<Entrega>(env.apiUrl + '/entrega/id/' + id);
  }

  buscarPorData(data: Date): Observable<Entrega>{
    return this.httpClient.get<Entrega>(env.apiUrl + '/entrega/data/' + data);
  }

  buscarPorDataBetween(start: Date, end: Date): Observable<Entrega>{
    return this.httpClient.get<Entrega>(env.apiUrl + '/entrega/entredata/' + start + '/' + end);
  }
  update(entrega: Entrega): Observable<Entrega> {
    return this.httpClient.put<Entrega>(env.apiUrl + '/entrega', entrega);
  }

  delete(id: number): Observable<void> {
    return this.httpClient.delete<void>(env.apiUrl + '/entrega/' + id);
  }
}
