import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UiPrimengModule } from '../ui-primeng/ui-primeng.module';
import { RouterModule } from '@angular/router';
import { FormsModule , ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule
  ],
  exports:[
    FormsModule,
    CommonModule,
    RouterModule,
    UiPrimengModule,
    ReactiveFormsModule
  ]
})
export class SharedModule { }
