import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { IBuscaProcessoRequestDTO } from '../core/models/busca-processo-request-dto';
import { SearchStateService } from '../../shared/services/search-state.service';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  private apiUrl = 'http://localhost:8081/api/v1/processos';

  constructor(private http: HttpClient, private searchStateService: SearchStateService) {}

  getByIdentificador(identificador: string): Observable<any> {
    return this.http.get(this.apiUrl + '/' + identificador);
  }

  getByIdentificadorLocal(identificador: string): Observable<any> {
    return this.http.get(this.apiUrl + '/local' + '/' + identificador);
  }

  search(buscaProcessoRequestDTO: IBuscaProcessoRequestDTO, size: number, nextTrf: number = 1, searchAfter?: number): Observable<any> {
    console.log("Dados recebidos: ", buscaProcessoRequestDTO.numeroProcesso, " ", buscaProcessoRequestDTO.classeCodigo, " ", buscaProcessoRequestDTO.orgaoJulgadorCodigo);
    console.log("size: ", size);
    console.log("nextTrf: ", nextTrf);

    let params = new HttpParams()
      .set('size', size.toString())
      .set('nextTrf', nextTrf.toString());

    if (searchAfter !== undefined) {
      params = params.set('searchAfter', searchAfter.toString());
    }

    return this.http.post<any>(this.apiUrl, buscaProcessoRequestDTO, { params }).pipe(
      map(response => {
        // Acessando as propriedades da resposta corretamente
        const resposta = response.data.map((item: any) => item);//item._source
        console.log("Body da resposta do back: ", resposta);
        const data = resposta || [];
        const nextTrf = data.nextTrf || null;
        const sortValue = data.sortValue || null;

        this.searchStateService.setHits(data);
        this.searchStateService.setNextTrf(nextTrf);
        this.searchStateService.setSortValue(sortValue);
        return response;
      })
    );
  }
}
