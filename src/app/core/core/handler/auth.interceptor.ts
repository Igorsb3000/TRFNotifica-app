import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../../../services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService) {}

  private excludedUrls = [
    { url: '/processos', method: 'POST' },
    { url: '/processos/', method: 'GET' },
    { url: '/token', method: 'POST' },
    { url: '/checkUsername', method: 'GET' },
    { url: '/usuarios', method: 'POST' },
   // { url: '/usuarios', method: 'GET' }
  ];

  private tokenRequiredUrls = [
    { url: '/processos/save', method: 'POST' }
  ];

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Verificar se a URL deve ser excluída do interceptor
    //const isExcluded = this.excludedUrls.some(url => req.url.includes(url));
    // Verificar se a URL e o método devem ser excluídos do interceptor
    const isExcluded = this.excludedUrls.some(exclusion => req.url.includes(exclusion.url) && req.method === exclusion.method);

    // Verifica se a URL requer o token
    const isTokenRequired = this.tokenRequiredUrls.some(inclusion => req.url.includes(inclusion.url) && req.method === inclusion.method);

    if (isExcluded && !isTokenRequired) {
      return next.handle(req);
    } else {
      // Obter o token do localStorage
    const authString = localStorage.getItem('AUTH_TRFNotifica');
    let token;

    if (authString) {
      const authObject = JSON.parse(authString);
      token = authObject.token;
    }

    // Clonar a requisição para adicionar o cabeçalho de autorização
    if (!this.authService.isTokenExpired(token)) {
      const cloned = req.clone({
        headers: req.headers.set('Authorization', `Bearer ${token}`)
      });
      return next.handle(cloned);
    } else {
      this.authService.logout();
      return next.handle(req);
    }
    }


  }
}
