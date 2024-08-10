import { AuthService } from '../../services/auth.service';
import { IUsuarioCadastro } from '../../models/credencial';
import { Component, NgZone } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../../../src/app/services/user.service';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrl: './user-form.component.css',
  providers: [MessageService]
})
export class UserFormComponent {
  form: FormGroup;
  userCadastre: IUsuarioCadastro;
  messageSucess:string = "Cadastro realizado com sucesso!";
  messageError:string = "Ocorreu um erro ao realizar o seu cadastro. Por favor, tente novamente.";
  isUsernameValid: boolean = false;

  constructor(private fb: FormBuilder, private router: Router, private authService: AuthService, private userService: UserService, private messageService: MessageService, private ngZone: NgZone) {
    this.form = this.fb.group({
      nome: ['', Validators.required], // Defina os controles do formulário
      usuario: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      senha: ['', Validators.required],
      senhaConfirmacao: ['', Validators.required]
      },{validators: this.checkPasswords}
    );
    this.userCadastre = {
      name: '',
      email: '',
      username: '',
      password: ''
    };
  }

  checkPasswords(group: AbstractControl) {
    const pass = group.get('senha')?.value;
    const confirmPass = group.get('senhaConfirmacao')?.value;
    return pass === confirmPass ? null : { notSame: true };
  }


  // Método para enviar o formulário
  onSubmit() {
    if (this.form.valid) {
      this.userCadastre.name = this.form.value.nome;
      this.userCadastre.email = this.form.value.email;
      this.userCadastre.username = this.form.value.usuario;
      this.userCadastre.password = this.form.value.senha;

      // Enviar os dados ao servico e exibir mensagem de sucesso ou de erro
      this.userService.createUser(this.userCadastre).subscribe({
        next: () => {
          this.showSuccess();
          setTimeout(() => {
            this.authService.irPaginaLogin();
          }, 2000);
        }
      });
    }
  }

  checkUsername(){
    this.userService.checkUsername(this.form.get("usuario")?.value).subscribe(data => {
      if(data === false){
        this.isUsernameValid = false;
      } else {
        this.isUsernameValid = true;
      }
    });
  }

  showSuccess() {
    this.messageService.add({ severity: 'success', summary: 'Success', detail: this.messageSucess });
  }

}
