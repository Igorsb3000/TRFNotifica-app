import { NgModule } from '@angular/core';
import { MyProcessesComponent } from './my-processes.component';
import { MyProcessesRoutingModule } from './my-processes-routing.module';
import { SharedModule } from '../../core/core/shared/shared.module';


@NgModule({
  declarations: [MyProcessesComponent],
  imports: [
    SharedModule,
    MyProcessesRoutingModule
  ]
})
export class MyProcessesModule { }
