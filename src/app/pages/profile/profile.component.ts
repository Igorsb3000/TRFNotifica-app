import { AuthService } from '../../services/auth.service';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { IUsuarioAtualizacao } from '../../models/credencial';
import { UserService } from '../../../../src/app/services/user.service';
import { EMessages } from '../../enum/messages.enum';
import { ActivatedRoute, Router } from '@angular/router';

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
  isEditable: { [key: string]: boolean } = {
    nome: false,
    email: false,
    usuario: false,
    senhaAtual: false,
    senhaNova: false,
  };

  constructor(private router: Router, private fb: FormBuilder, private messageService: MessageService, private authService: AuthService, private userService: UserService) {
    this.form = this.fb.group({
      nome: new FormControl({value: '', disabled: true}, Validators.required),
      usuario: new FormControl({value: '', disabled: true}, Validators.required),
      email: new FormControl({value: '', disabled: true}, [Validators.required, Validators.email]),
      senhaAtual: [''],
      senhaNova: [''],
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
    this.loadDataUser();
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
      }
    });
  }

  toggleEditable(field: string): void {
    const control = this.form?.get(field);
    if (control) {
      if (control.disabled) {
        control?.enable();
      } else {
        control?.disable();
      }
    }
  }

  showUpdatedSucess() {
    this.messageService.add({ severity: 'success', summary: this.titleUpdatedProfileSucess, detail: this.messageUpdatedProfileSucess});
  }

}
