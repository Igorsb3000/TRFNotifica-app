import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IBuscaProcessoRequestDTO } from '../core/models/busca-processo-request-dto';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  private apiUrl = 'http://localhost:8081/api/v1/processos';

  constructor(private http: HttpClient) {}

  search(buscaProcessoRequestDTO: IBuscaProcessoRequestDTO, size: number, nextTrf: number = 1, searchAfter?: number): Observable<any> {
    let params = new HttpParams()
      .set('size', size.toString())
      .set('nextTrf', nextTrf.toString());

    if (searchAfter !== undefined) {
      params = params.set('searchAfter', searchAfter.toString());
    }

    return this.http.post(`${this.apiUrl}`, buscaProcessoRequestDTO, { params });
  }
}
