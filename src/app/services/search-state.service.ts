import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class SearchStateService {
  private dataSubject = new BehaviorSubject<any[]>([]);
  private nextTrfSubject = new BehaviorSubject<number | undefined>(undefined);
  private sortValueSubject = new BehaviorSubject<string | undefined>(undefined);

  data$ = this.dataSubject.asObservable();
  nextTrf$ = this.nextTrfSubject.asObservable();
  sortValue$ = this.sortValueSubject.asObservable();


  getData(): Observable<any[]> {
    return this.dataSubject.asObservable();
  }

  getNextTrf(): Observable<number | undefined>{
    return this.nextTrfSubject.asObservable();
  }

  getSortValue(): Observable<string | undefined>{
    return this.sortValueSubject.asObservable();
  }

  setHits(data: any[]): void {
    this.dataSubject.next(data);
  }

  setNextTrf(nextTrf: number | undefined): void {
    this.nextTrfSubject.next(nextTrf);
  }

  setSortValue(sortValue: string | undefined): void {
    this.sortValueSubject.next(sortValue);
  }
}
