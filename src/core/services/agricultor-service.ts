import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Agricultor} from '../models/agricultor';
import {env} from '../../environment/environment.prod';

@Injectable({
  providedIn: 'root',
})
export class AgricultorService {
  constructor(private httpClient: HttpClient){
  }

  getAll(): Observable<Agricultor[]>{
    return this.httpClient.get<Agricultor[]>(env.apiUrl + '/agricultor/listar');
  }

  buscarPorId(id: string): Observable<Agricultor>{
    return this.httpClient.get<Agricultor>(env.apiUrl + '/agricultor/id/' + id);
  }

  buscarPorAny(param: string): Observable<Agricultor>{
    return this.httpClient.get<Agricultor>(env.apiUrl + '/agricultor/buscar/' + param);
  }

  create(agricultor: Agricultor): Observable<Agricultor> {
    return this.httpClient.post<Agricultor>(env.apiUrl + '/agricultor', agricultor);
  }

  update(agricultor: Agricultor): Observable<Agricultor> {
    return this.httpClient.put<Agricultor>(env.apiUrl + '/agricultor', agricultor);
  }

  delete(id: number): Observable<void> {
    return this.httpClient.delete<void>(env.apiUrl + '/agricultor/' + id);
  }
}
