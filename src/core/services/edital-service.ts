import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Edital} from '../models/edital';
import {env} from '../../environment/environment.prod';

@Injectable({
  providedIn: 'root',
})
export class EditalService {
  constructor(private httpClient: HttpClient){
  }

  getAll(): Observable<Edital[]>{
    return this.httpClient.get<Edital[]>(env.apiUrl + '/edital/listar');
  }

  buscarPorId(id: string): Observable<Edital>{
    return this.httpClient.get<Edital>(env.apiUrl + '/edital/id/' + id);
  }

  buscarPorAny(param: string): Observable<Edital[]>{
    return this.httpClient.get<Edital[]>(env.apiUrl + '/edital/buscar/' + param);
  }

  update(edital: Edital): Observable<Edital> {
    return this.httpClient.put<Edital>(env.apiUrl + '/edital', edital);
  }

  delete(id: number): Observable<void> {
    return this.httpClient.delete<void>(env.apiUrl + '/edital/' + id);
  }

  create(edital: Edital): Observable<Edital> {
    return this.httpClient.post<Edital>(env.apiUrl + '/edital', edital);
  }
}
