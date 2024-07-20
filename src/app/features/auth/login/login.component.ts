import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { ICredencial, IUsuario } from '../../../core/models/credencial';
import { environment } from '../../../environments/environments';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit{
  //username : string = '';
  //password : string = '';
  form: FormGroup;
  userLogin: ICredencial;

  constructor(private fb: FormBuilder, private authService: AuthService){
    this.form = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      }
    );
    this.userLogin = {
      username: '',
      password: ''
    }
  }

  ngOnInit(): void {
    const authData = localStorage.getItem(environment.auth);
    if (authData) {
      const user = JSON.parse(authData);
      //this.username = user.usuario || '';
    }
  }

  async onLogin(){
    if(this.form.valid){
      this.userLogin.username = this.form.value.username;
      this.userLogin.password = this.form.value.password;
      console.log("Login válido: ", this.form.value.username);
      this.authService.login(this.userLogin);
    }
    /*
    await this.authService.login({
      username: this.username,
      password: this.password
    } as ICredencial)
    console.log("Dados de login: ", this.username, " - ", this.password);
    */
  }

}
