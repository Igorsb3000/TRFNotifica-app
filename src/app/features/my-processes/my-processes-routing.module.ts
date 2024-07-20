import { NgModule } from '@angular/core';
import { MyProcessesComponent } from './my-processes.component';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', component: MyProcessesComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MyProcessesRoutingModule { }
