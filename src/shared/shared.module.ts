import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UiPrimengModule } from '../app/core/core/ui-primeng/ui-primeng.module';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule,
    //LoginRoutingModule
    //LoginModule,
  ],
  exports:[
    //UiPrimengModule,
    FormsModule,
    CommonModule,
    RouterModule,
    UiPrimengModule
    //oginRoutingModule
    //LoginModule
  ]
})
export class SharedModule { }
