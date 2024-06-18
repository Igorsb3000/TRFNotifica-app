import { Injectable, NgZone } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, firstValueFrom } from 'rxjs';
import { AuthConst } from '../../../core/core/auth.const';
import { ICredencial, IUsuario } from '../../../core/models/credencial';
import { BaseService } from '../../../core/base/base.service';
import { environment } from '../../../environments/environments';
import { Crypter } from '../../../utils/crypto.util';


@Injectable({
  providedIn: 'root',
})
export class AuthService extends BaseService{
  private readonly urlApi = environment.urlApi;
  private readonly ENDPOINT = AuthConst.END_POINT_TOKEN;
  private readonly URL = this.urlApi + this.ENDPOINT;

  private isAuthenticatedSubject = new BehaviorSubject<boolean>(!!localStorage.getItem('AUTH_TRFNotifica'));
  isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor(
    private ngZone: NgZone,
    private router: Router
  ) {super()}

  async login(credencial : ICredencial){
    const secret = environment.apiSecret;
    const encryptado = Crypter.encrypt(secret, `${credencial.username}:${credencial.password}`)
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'Authorization': 'Basic ' + encryptado
      })
    };
    try {
      const payload = await firstValueFrom(this.httpObj().post<any>(this.URL, null, httpOptions));

      console.log(btoa(`${credencial.username}:${credencial.password}`))

      const user =  {
        'usuario': credencial.username,
        'token': payload['token'],
      } as IUsuario;

      localStorage.clear();
      localStorage.setItem(environment.auth, JSON.stringify(user));
      this.isAuthenticatedSubject.next(true);
      this.irPaginaInicial();
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  getUsuario(){
    const authData = localStorage.getItem(environment.auth);
    let username;
    if (authData) {
      const user = JSON.parse(authData);
      username = user.usuario || '';
    }
    return username;
  }

  irPaginaInicial(){
    this.ngZone.run(() => {
      this.router.navigate([AuthConst.PAGINA_INICIAL]);
    });
  }

  logoff(){
    localStorage.clear();
    this.irPaginaLogin();
  }

  irPaginaLogin(){
    localStorage.clear();
    this.ngZone.run(() => {
      this.router.navigate([AuthConst.PAGINA_LOGIN]);
    });

  }
  /*login() {
    localStorage.setItem('AUTH_TRFNotifica', 'your-auth-token');
    this.isAuthenticatedSubject.next(true);
  }*/

  logout() {
    localStorage.removeItem('AUTH_TRFNotifica');
    this.isAuthenticatedSubject.next(false);
  }

}
