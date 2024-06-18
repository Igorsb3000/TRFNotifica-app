import { NgModule } from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';
import { CardModule } from 'primeng/card';
import { FloatLabelModule } from 'primeng/floatlabel';
import { ButtonModule } from 'primeng/button';
import { PasswordModule } from 'primeng/password';
import { MenubarModule } from 'primeng/menubar';
import { RadioButtonModule } from 'primeng/radiobutton';
import { InputMaskModule } from 'primeng/inputmask';

@NgModule({
  exports:[
    InputTextModule,
    CardModule,
    FloatLabelModule,
    ButtonModule,
    PasswordModule,
    MenubarModule,
    RadioButtonModule,
    InputMaskModule
  ]
})
export class UiPrimengModule { }
