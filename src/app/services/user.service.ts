import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IUsuarioAtualizacao, IUsuarioCadastro } from '../models/credencial';
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
    return this.http.get(this.apiUrl);
  }

  checkUsername(username: String){
    return this.http.get(this.apiUrl + '/checkUsername/' + username);
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
    return this.http.put(this.apiUrl, user);
  }
}
