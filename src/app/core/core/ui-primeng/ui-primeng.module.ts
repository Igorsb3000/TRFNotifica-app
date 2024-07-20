import { NgModule } from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';
import { CardModule } from 'primeng/card';
import { FloatLabelModule } from 'primeng/floatlabel';
import { ButtonModule } from 'primeng/button';
import { PasswordModule } from 'primeng/password';
import { MenubarModule } from 'primeng/menubar';
import { RadioButtonModule } from 'primeng/radiobutton';
import { InputMaskModule } from 'primeng/inputmask';
import { TableModule } from 'primeng/table';
import { MessagesModule } from 'primeng/messages';
import { MessageModule } from 'primeng/message';
import { ToastModule} from 'primeng/toast';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { DividerModule } from 'primeng/divider';
import { PaginatorModule } from 'primeng/paginator';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { InputNumberModule } from 'primeng/inputnumber';

@NgModule({
  exports:[
    InputTextModule,
    CardModule,
    FloatLabelModule,
    ButtonModule,
    PasswordModule,
    MenubarModule,
    RadioButtonModule,
    InputMaskModule,
    TableModule,
    MessagesModule,
    MessageModule,
    ToastModule,
    ProgressSpinnerModule,
    DividerModule,
    PaginatorModule,
    ConfirmDialogModule,
    InputNumberModule
  ]
})
export class UiPrimengModule { }
