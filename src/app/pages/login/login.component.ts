import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { ICredencial } from '../../models/credencial';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
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

  async onLogin(){
    if(this.form.valid){
      this.userLogin.username = this.form.value.username;
      this.userLogin.password = this.form.value.password;
      await this.authService.login(this.userLogin);
    }
  }

}
