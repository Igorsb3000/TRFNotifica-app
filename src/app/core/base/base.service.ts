import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable } from 'rxjs';

export abstract class BaseService {

  protected readonly HEADERS_NOAUTH = new HttpHeaders({ 'Content-Type': 'application/x-www-urlencoded', 'No-Auth': 'True'});
  private http : HttpClient = inject(HttpClient);

  protected httpObj() : HttpClient {
    return this.http;
  }

  protected httpGet<T>(resource: string): Observable<T> {
    return this.http.get<T>(resource);
  }

  protected httpPost<T>(resource: string, body: any | null): Observable<T> {
    return this.http.post<T>(resource, body);
  }

  protected httpPut<T>(resource: string, body: any | null): Observable<T> {
    return this.http.put<T>(resource, body);
  }

  protected httpPatch<T>(resource: string, body: any | null): Observable<T> {
    return this.http.patch<T>(resource, body);
  }

  protected httpDelete<T>(resource: string): Observable<T> {
      return this.http.delete<T>(resource);
  }
}
