import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Cronograma} from '../models/cronograma';
import {env} from '../../environment/environment.prod';

@Injectable({
  providedIn: 'root',
})
export class CronogramaService {
  constructor(private httpClient: HttpClient){
  }

  getAll(): Observable<Cronograma[]>{
    return this.httpClient.get<Cronograma[]>(env.apiUrl + '/cronograma/listar');
  }

  buscarPorId(id: string): Observable<Cronograma>{
    return this.httpClient.get<Cronograma>(env.apiUrl + '/cronograma/id/' + id);
  }

  buscarPorAny(param: string): Observable<Cronograma>{
    return this.httpClient.get<Cronograma>(env.apiUrl + '/cronograma/buscar/' + param);
  }

  buscarPorData(data: Date): Observable<Cronograma>{
    return this.httpClient.get<Cronograma>(env.apiUrl + '/cronograma/data/' + data);
  }

  buscarPorDataBetween(start: Date, end: Date): Observable<Cronograma>{
    return this.httpClient.get<Cronograma>(env.apiUrl + '/cronograma/databetween/' + start + '/' + end);
  }
  update(cronograma: Cronograma): Observable<Cronograma> {
    return this.httpClient.put<Cronograma>(env.apiUrl + '/cronograma', cronograma);
  }

  delete(id: number): Observable<void> {
    return this.httpClient.delete<void>(env.apiUrl + '/cronograma/' + id);
  }

  create(cronograma: Cronograma): Observable<Cronograma> {
    return this.httpClient.post<Cronograma>(env.apiUrl + '/cronograma', cronograma);
  }
}
