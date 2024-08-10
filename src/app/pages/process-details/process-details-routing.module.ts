import { NgModule } from '@angular/core';
import { ProcessDetailsComponent } from './process-details.component';
import { RouterModule, Routes } from '@angular/router';


const routes: Routes = [
  { path: '', component: ProcessDetailsComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProcessDetailsRoutingModule { }
