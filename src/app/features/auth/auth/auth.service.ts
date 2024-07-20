import { Injectable, NgZone } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, firstValueFrom } from 'rxjs';
import { AuthConst } from '../../../core/core/auth.const';
import { ICredencial, IUsuario } from '../../../core/models/credencial';
import { BaseService } from '../../../core/base/base.service';
import { environment } from '../../../environments/environments';
import { Crypter } from '../../../utils/crypto.util';
import { jwtDecode } from 'jwt-decode';


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
    private router: Router,
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

      const user =  {
        'usuario': credencial.username,
        'token': payload['token'],
      } as IUsuario;

      localStorage.setItem(environment.auth, JSON.stringify(user));
      this.isAuthenticatedSubject.next(true);
      this.redirectAfterLogin();
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
    const redirectUrl = this.getRedirectUrl() || '/';
    this.router.navigate([redirectUrl]);
  }

  irPaginaLogin(): void {
    const currentUrl = this.router.url;
    if (currentUrl.includes('search-results') || currentUrl.includes('process-details') || currentUrl.includes('my-processes')) {
      this.setRedirectUrl(currentUrl);
    }
    this.router.navigate(['/login']);
  }

  setRedirectUrl(url: string): void {
    localStorage.setItem('redirectUrl', url);
  }

  logout() {
    localStorage.clear();
    this.isAuthenticatedSubject.next(false);
    this.irPaginaInicial();
  }

  checkAuthentication() {
    const auth = localStorage.getItem('AUTH_TRFNotifica');

    if (auth) {
      const authData = JSON.parse(auth);
      const token = authData.token;

      if (token && !this.isTokenExpired(token)) {
        this.isAuthenticatedSubject.next(true);
        return true;
      } else {
        localStorage.clear();
        this.isAuthenticatedSubject.next(false);
        return false;
      }
    } else {
      localStorage.clear();
      this.isAuthenticatedSubject.next(false);
      return false;
    }
  }


  isTokenExpired(token: string): boolean {
    try {
      const decodedToken: any = jwtDecode(token);
      const expirationDate = new Date(0);
      expirationDate.setUTCSeconds(decodedToken.exp);
      return expirationDate < new Date();
    } catch (error) {
      console.error('Error decoding token', error);
      return true;
    }
  }

  redirectAfterLogin(): void {
    const redirectUrl = this.getRedirectUrl();
    if (redirectUrl) {
      this.router.navigateByUrl(redirectUrl);
    } else {
      this.router.navigate(['/']);
    }
  }

  getRedirectUrl(): string | null {
    const url = localStorage.getItem('redirectUrl');
    localStorage.removeItem('redirectUrl');
    return url;
  }

}
