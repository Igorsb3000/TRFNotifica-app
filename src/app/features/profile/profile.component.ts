import { AuthService } from './../auth/auth/auth.service';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { IUsuarioAtualizacao, IUsuarioCadastro } from '../../core/models/credencial';
import { UserService } from '../../../shared/services/user.service';
import { EMessages } from '../enum/messages.enum';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
  providers: [MessageService]
})
export class ProfileComponent implements OnInit {
  form: FormGroup;
  userUpdate: IUsuarioAtualizacao;
  isFormModified: boolean = false;
  initialFormValues: Object = {};
  titleUpdatedProfileSucess : string = EMessages.titleUpdatedProfileSucess;
  messageUpdatedProfileSucess: string = EMessages.messageUpdatedProfileSucess;
  titleUpdatedProfileError : string = EMessages.titleUpdatedProfileError;
  messageUpdatedProfileError: string = EMessages.messageUpdatedProfileError;

  constructor(private fb: FormBuilder, private messageService: MessageService, private authService: AuthService, private userService: UserService) {
    this.form = this.fb.group({
      nome: ['', Validators.required],
      usuario: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      senhaAtual: [''],
      senhaNova: ['']
      },{validators: this.checkPasswords}
    );
    this.userUpdate = {
      name: '',
      email: '',
      username: '',
      password: '',
      newPassword:''
    };
  }

  ngOnInit(): void {
    if(this.authService.checkAuthentication()){
      this.loadDataUser();
    } else {
      this.authService.irPaginaLogin();
    }

    this.form.valueChanges.subscribe(() => {
      this.checkFormModification();
    });
  }

  checkFormModification() {
    const currentFormValues: Object = this.form.getRawValue();
    this.isFormModified = JSON.stringify(currentFormValues) !== JSON.stringify(this.initialFormValues);
  }

  checkPasswords(group: AbstractControl) {
    const passOld = group.get('senhaAtual')?.value;
    const passNew = group.get('senhaNova')?.value;

    if (passOld && !passNew) {
      return { newPassRequired: true };
    }

    if (passOld && passNew && passOld === passNew) {
      return { notSame: true };
    }
    return null;
  }

  loadDataUser(){
    this.userService.getUser().subscribe({
      next: response => {
        this.form.patchValue({
          nome: response.name,
          usuario: response.username,
          email: response.email
        });
        this.initialFormValues = this.form.getRawValue();
        this.isFormModified = false;
      },
      error: error => {
        console.log("Erro: ", error);
      }
    });
  }

  onSubmit(){
    this.userUpdate.name = this.form.get('nome')?.value;
    this.userUpdate.username = this.form.get('usuario')?.value;
    this.userUpdate.email = this.form.get('email')?.value;
    this.userUpdate.password = this.form.get('senhaAtual')?.value || null;
    this.userUpdate.newPassword = this.form.get('senhaNova')?.value || null;

    this.userService.updateUser(this.userUpdate).subscribe({
      next: response => {
        this.loadDataUser();
        this.showUpdatedSucess()
      },
      error: error => {
        console.log("Erro: ", error);
        this.showUpdatedError(error);
      }
    });
  }

  showUpdatedSucess() {
    this.messageService.add({ severity: 'success', summary: this.titleUpdatedProfileSucess, detail: this.messageUpdatedProfileSucess});
  }

  showUpdatedError(error: string) {
    this.messageService.add({ severity: 'error', summary: this.titleUpdatedProfileError, detail: this.messageUpdatedProfileError + " Erro: " + error});
  }

}
