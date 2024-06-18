import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../shared/shared.module';
import { MainLayoutComponent } from './main-layout.component';
import { MainLayoutRoutingModule } from './main-layout-routing.module';

@NgModule({
  declarations: [MainLayoutComponent],
  imports: [
    SharedModule,
    MainLayoutRoutingModule,
  ]
})
export class MainLayoutModule { }
