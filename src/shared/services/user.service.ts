import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IUsuarioAtualizacao, IUsuarioCadastro } from '../../app/core/models/credencial';
import { environment } from '../../app/environments/environments';
import { Crypter } from '../../app/utils/crypto.util';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = environment.urlApi + '/v1/usuarios';
  private secret = environment.apiSecret;

  constructor(private http: HttpClient) { }

  createUser(user: IUsuarioCadastro): Observable<any> {
    const passwordEncrypt = Crypter.encrypt(this.secret, user.password);
    user.password = passwordEncrypt;
    return this.http.post(this.apiUrl, user);
  }

  getUser(): Observable<any> {
    console.log("chamou o GET da URL: " + this.apiUrl);
    return this.http.get(this.apiUrl);
  }

  updateUser(user: IUsuarioAtualizacao): Observable<any> {

    if(user.password != '' && user.password != null){
      const oldPasswordEncrypt = Crypter.encrypt(this.secret, user.password);
      user.password = oldPasswordEncrypt;
    }
    if(user.newPassword != '' && user.password != null){
      const newPasswordEncrypt = Crypter.encrypt(this.secret, user.newPassword);
      user.newPassword = newPasswordEncrypt
    }

    console.log("Estou enviando PUT: ", user);
    console.log("URL: ", this.apiUrl);
    return this.http.put(this.apiUrl, user);
  }
}
