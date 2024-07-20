import { NgModule } from '@angular/core';
import { UserFormComponent } from './user-form.component';
import { RouterModule, Routes } from '@angular/router';


const routes: Routes = [
  { path: '', component: UserFormComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserFormRoutingModule { }
