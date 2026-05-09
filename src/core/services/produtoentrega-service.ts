import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Produtoentrega} from '../models/produtoentrega';
import {env} from '../../environment/environment.prod';

@Injectable({
  providedIn: 'root',
})
export class ProdutoentregaService {
  constructor(private httpClient: HttpClient){
  }

  getAll(): Observable<Produtoentrega[]>{
    return this.httpClient.get<Produtoentrega[]>(env.apiUrl + '/produtoentrega/listar');
  }

  buscarPorAny(param: string): Observable<Produtoentrega>{
    return this.httpClient.get<Produtoentrega>(env.apiUrl + '/produtoentrega/buscar/' + param);
  }

  buscarPorId(id: string): Observable<Produtoentrega>{
    return this.httpClient.get<Produtoentrega>(env.apiUrl + '/produtoentrega/id/' + id);
  }

  buscarPorIdEntrega(identrega: string): Observable<Produtoentrega>{
    return this.httpClient.get<Produtoentrega>(env.apiUrl + '/produtoentrega/identrega/' + identrega);
  }

  create(produtoentrega: Produtoentrega): Observable<Produtoentrega> {
    return this.httpClient.post<Produtoentrega>(env.apiUrl + '/produtoentrega', produtoentrega);
  }

  update(produtoentrega: Produtoentrega): Observable<Produtoentrega> {
    return this.httpClient.put<Produtoentrega>(env.apiUrl + '/produtoentrega', produtoentrega);
  }

  delete(id: number): Observable<void> {
    return this.httpClient.delete<void>(env.apiUrl + '/produtoentrega/' + id);
  }
}
