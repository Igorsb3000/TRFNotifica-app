import { NgModule } from '@angular/core';
import { SearchResultsComponent } from './search-results.component';
import { SearchResultsRoutingModule } from './search-results-routing.module';
import { SharedModule } from '../../../shared/shared.module';



@NgModule({
  declarations: [SearchResultsComponent],
  imports: [
    SharedModule,
    SearchResultsRoutingModule,
  ]
})
export class SearchResultsModule { }
