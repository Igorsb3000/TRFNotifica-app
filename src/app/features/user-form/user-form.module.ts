import { NgModule } from '@angular/core';
import { UserFormComponent } from './user-form.component';
import { UserFormRoutingModule } from './user-form-routing.module';
import { SharedModule } from '../../../shared/shared.module';


@NgModule({
  declarations: [UserFormComponent],
  imports: [
    SharedModule,
    UserFormRoutingModule
  ]
})
export class UserFormModule { }
