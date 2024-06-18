import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Obter o token do localStorage
    const authString = localStorage.getItem('AUTH_TRFNotifica');
    let token;

    if (authString) {
      const authObject = JSON.parse(authString);
      token = authObject.token;
    }

    // Clonar a requisição para adicionar o cabeçalho de autorização
    if (token) {
      const cloned = req.clone({
        headers: req.headers.set('Authorization', `Bearer ${token}`)
      });
      return next.handle(cloned);
    } else {
      return next.handle(req);
    }
  }
}
