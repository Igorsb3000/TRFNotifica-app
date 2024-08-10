import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { errorProviders } from './handler';
import { AuthGuard } from './auth/auth.guard';

@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ],
  providers: [
    errorProviders,
    AuthGuard
  ]
})
export class CoreModule { }
