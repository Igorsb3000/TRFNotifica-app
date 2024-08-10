import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../app/environments/environments';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private apiUrl = environment.urlApi + '/v1/processos';

  constructor(private http: HttpClient) {}

  saveProcess(processo: string): Observable<void> {
    const url = `${this.apiUrl}/save`;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this.http.post<void>(url, processo, { headers });
  }

  removeProcess(identificador: string): Observable<void> {
    const url = `${this.apiUrl}/${identificador}`;
    return this.http.delete<void>(url);
  }

  getActiveNotifications(): Observable<any> {
    return this.http.get(`${this.apiUrl}`);
  }
}
