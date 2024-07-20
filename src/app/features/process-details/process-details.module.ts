import { NgModule } from '@angular/core';
import { ProcessDetailsComponent } from './process-details.component';
import { SharedModule } from '../../../shared/shared.module';
import { ProcessDetailsRoutingModule } from './process-details-routing.module';


@NgModule({
  declarations: [ProcessDetailsComponent],
  imports: [
    SharedModule,
    ProcessDetailsRoutingModule
  ]
})
export class ProcessDetailsModule { }
