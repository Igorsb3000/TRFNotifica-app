import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UiPrimengModule } from '../app/core/core/ui-primeng/ui-primeng.module';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule
    //LoginRoutingModule
    //LoginModule,
  ],
  exports:[
    //UiPrimengModule,
    FormsModule,
    CommonModule,
    RouterModule,
    UiPrimengModule,
    ReactiveFormsModule
    //oginRoutingModule
    //LoginModule
  ]
})
export class SharedModule { }
