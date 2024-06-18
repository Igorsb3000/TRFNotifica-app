import { IBuscaProcessoRequestDTO } from '../../core/models/busca-processo-request-dto';
import { SearchService } from './../search.service';
import { Component } from '@angular/core';
import { AuthService } from '../auth/auth/auth.service';
import { Route, Router } from '@angular/router';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrl: './search.component.css'
})
export class SearchComponent {
  numeroProcesso: string = '';
  codigoClasse: number = 0;
  codigoOrgaoJulgador: number = 0;
  searchOption: string = '';
  size: number = 10;
  nextTrf: number = 1;
  searchAfter: number | undefined;

  //itens: String[] = ['inicio', 'sair'];

  itens: any[] = [
  { label: 'Busca', icon: 'pi pi-fw pi-search', routerLink: ['/home'] },
  { label: 'Meus processos', icon: 'pi pi-fw pi-bell', routerLink: ['/products'] },
  { label: 'Perfil', icon: 'pi pi-fw pi-user', routerLink: ['/services'] },
  { label: 'sair', icon: 'pi pi-fw pi-sign-out', routerLink: ['/logout'] }
  ]
  /*[
    { label: 'Busca', icon: '../../../assets/lupa_final.png' },
    { label: 'Processos de Interesse', icon: '../../../assets/documento_notificacao_final.png' },
    { label: 'Perfil', icon: '../../../assets/perfil_final.png' },
    { label: '', icon: '../../../assets/sair_final.png' }

  ];*/
  constructor(
    private authService : AuthService,
    private searchService: SearchService,
    private router: Router
  ){}

  ngOnInit() {
    //this.username = this.authService.getUsuario().toUpperCase();
  }

  sair(){
    this.authService.logoff();
  }

  imprimir(){
    console.log(this.searchOption, " : ", this.numeroProcesso, ", ", this.codigoClasse, ", ", this.codigoOrgaoJulgador);
  }
  limparCampos() {
    this.numeroProcesso = '';
    this.codigoClasse = 0;
    this.codigoOrgaoJulgador = 0;
  }

  buscar() {

    const buscaProcesso: IBuscaProcessoRequestDTO = {
      numeroProcesso: this.numeroProcesso.replace(/\D/g, '') || undefined,
      codigoClasse: this.codigoClasse || undefined,
      codigoOrgaoJulgador: this.codigoOrgaoJulgador || undefined
    };
    console.log("Dados da busca: ", buscaProcesso);

    this.searchService.search(buscaProcesso, this.size, this.nextTrf, this.searchAfter).subscribe(response => {
      this.router.navigate(['/search-results'], { state: { results: response } });
    });
  }
}
