import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { ICredencial } from '../../../core/models/credencial';
import { environment } from '../../../environments/environments';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit{
  username : string = '';
  password : string = '';

  constructor(private authService: AuthService){}

  ngOnInit(): void {
    const authData = localStorage.getItem(environment.auth);
    if (authData) {
      const user = JSON.parse(authData);
      this.username = user.usuario || '';
    }
  }

  async onLogin(){
    await this.authService.login({
      username: this.username,
      password: this.password
    } as ICredencial)
    console.log("Dados de login: ", this.username, " - ", this.password);
  }

}
