// process-state.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProcessStateService {
  private selectedProcessSource = new BehaviorSubject<any>(null);
  selectedProcess$ = this.selectedProcessSource.asObservable();

  selectProcess(process: any) {
    this.selectedProcessSource.next(process);
  }
}
