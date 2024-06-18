import { NgModule } from '@angular/core';
import { MainLayoutComponent } from './main-layout.component';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', component: MainLayoutComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MainLayoutRoutingModule { }
