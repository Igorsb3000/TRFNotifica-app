import { AuthService } from './../auth/auth/auth.service';
import { IUsuarioCadastro } from './../../core/models/credencial';
import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../../shared/services/user.service';
import { MessageService } from 'primeng/api';

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

  constructor(private fb: FormBuilder,private authService: AuthService, private userService: UserService, private messageService: MessageService) {
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
        next: response => {
          this.showSuccess();
          setTimeout(() => {
            this.authService.irPaginaLogin();
          }, 2000);
        },
        error: error => {
          this.showError(error);
        }
      });
    } else {
      console.log('Formulário inválido. Verifique os campos.');
    }
  }

  showSuccess() {
    this.messageService.add({ severity: 'success', summary: 'Success', detail: this.messageSucess });
  }

  showError(error: string) {
    this.messageService.add({ severity: 'error', summary: 'Error', detail: this.messageError + error});
  }
}
