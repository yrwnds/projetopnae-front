import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {ActivatedRoute, Router} from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly TOKEN_KEY = 'auth_token';
  private readonly USER_KEY = 'auth_user';

  constructor(private httpClient: HttpClient,
              private router: Router,
              private route: ActivatedRoute){
  }

  login(email: string, senha: string): Observable<{token: string}>{
    return this.httpClient.post<{token:string}>("http://localhost:8080/projetopnae/login", {email, senha});
  }

  setToken(token: string){
    localStorage.setItem(this.TOKEN_KEY, token);
    const user = this.userFromToken(token);
    if(user){
      localStorage.setItem(this.USER_KEY, JSON.stringify(user));
    }
  }

  private userFromToken(token: String){
    const payload = token.split('.')[1];
    if(payload === '') return null;
    const decoded = JSON.parse(atob(payload));
    return{
      matricula: decoded.sub ?? undefined,
      role: decoded.role ?? undefined
    };
  }

  getToken(){
    return localStorage.getItem(this.TOKEN_KEY);
  }

  getUserRole(){
    const token = this.getToken()
    // @ts-ignore
    const payload = token.split('.')[1];
    const decoded = JSON.parse(atob(payload));
    return decoded.role
  }

  getUserMat(){
    const token = this.getToken()
    // @ts-ignore
    const payload = token.split('.')[1];
    const decoded = JSON.parse(atob(payload));
    return decoded.sub
  }

  isLogged(){
    return !!this.getToken();
  }

  logout(){
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    this.router.navigate(['/login']);
  }
}
