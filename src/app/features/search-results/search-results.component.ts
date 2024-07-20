import { NotificationService } from './../../../shared/services/notification.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SearchService } from '../search.service';
import { IBuscaProcessoRequestDTO } from '../../core/models/busca-processo-request-dto';
import { Location } from '@angular/common';
import { AuthService } from '../auth/auth/auth.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { EMessages } from '../enum/messages.enum';
import { NavigationContextService } from '../../../shared/services/navigation-context.service';

/*
interface Processo {
  id: string;
}*/

@Component({
  selector: 'app-search-results',
  templateUrl: './search-results.component.html',
  styleUrl: './search-results.component.css',
  providers: [ConfirmationService, MessageService]
})

export class SearchResultsComponent implements OnInit {
  data: any[] = [];
  displayedData: any[] = [];
  sortValue: number = 0;
  isLoading: boolean = false;
  //paginatedData: Processo[] = []; // Dados paginados dos processos
  notificationStates: { [id: string]: boolean } = {}; // Estados de notificação para cada processo
  numeroProcesso:string = "";
  codigoClasse: number = 0;
  codigoOrgaoJulgador: number = 0;
  size: number = 0;
  nextTrf: number = 0;
  searchAfter: number = 0;
  totalResults: number = 0;
  currentPage: number = 0;
  sortOptions = [
    { label: 'Mais recente', value: 'desc' },
    { label: 'Mais antigo', value: 'asc' }
  ];
  selectedSortOrder: string = 'desc';
  titleErrorNotification: string = EMessages.titleErrorNotification;
  titleEnableNotification: string = EMessages.titleEnableNotification;
  titleDisableNotification: string = EMessages.titleDisableNotification;
  messageErrorNotification: string = EMessages.messageErrorNotification;
  messageEnableNotification: string = EMessages.messageEnableNotification;
  messageDisableNotification: string = EMessages.messageDisableNotification;

  constructor(
    private searchService: SearchService,
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private notificationService: NotificationService,
    private authService: AuthService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private navigationContextService: NavigationContextService
  ) {}

    ngOnInit(): void {
      if(this.authService.checkAuthentication()){
        this.loadActiveNotifications();
      }

      this.route.queryParams.subscribe(params => {
        this.numeroProcesso = params['numeroProcesso'];
        this.codigoClasse = params['codigoClasse'];
        this.codigoOrgaoJulgador = params['codigoOrgaoJulgador'];
        this.size = params['size'];
        this.nextTrf = params['nextTrf'];
        this.searchAfter = params['searchAfter'];
        this.buscar( this.numeroProcesso, this.codigoClasse, this.codigoOrgaoJulgador, this.size, this.nextTrf, this.searchAfter );
      });
    }


    buscar(numeroProcesso: string, codigoClasse: number, codigoOrgaoJulgador:number, size: number, nextTrf: number, searchAfter:number) {
      this.isLoading = true;

      const buscaProcesso: IBuscaProcessoRequestDTO = {
        numeroProcesso: numeroProcesso ? numeroProcesso.replace(/\D/g, '') : '',//params.numeroProcesso?.replace(/\D/g, '') || undefined,
        classeCodigo: codigoClasse ? parseInt(codigoClasse?.toString().replace(/\D/g, ''), 10) : 0, //params.codigoClasse,
        orgaoJulgadorCodigo: codigoOrgaoJulgador ? parseInt(codigoOrgaoJulgador?.toString().replace(/\D/g, ''), 10) : 0 //params.codigoOrgaoJulgador
      };
      console.log("Buscar() search results: ", buscaProcesso);

      this.searchService.search(buscaProcesso, size, nextTrf, searchAfter).subscribe({
        next: response => {
          this.isLoading = false;
          this.data = [...this.data, ...response.data];
          this.sortValue = response?.sortValue;
          this.nextTrf = response?.nextTrf;
          this.totalResults = response?.totalResults;
          this.updateDisplayedData();
          console.log("Response: ", response);
          console.log("Data results: ", this.data);
        },
        error: error => {
          this.isLoading = false;
          console.error('Erro ao buscar processos', error);
        }
      });
    }

    /*
    updateDisplayedData() {
      const start = this.currentPage * this.size;
      const end = start + this.size;
      this.displayedData = this.data.slice(start, end);
    }

    onLoadMore(event: any): void {
      this.currentPage = event.page;
      //this.currentPage = event.first / this.size;

      if (this.displayedData.length < (this.currentPage + 1) * this.size) {
        this.buscar(this.numeroProcesso, this.codigoClasse, this.codigoOrgaoJulgador, this.size, this.nextTrf, this.sortValue);
      } else {
        this.updateDisplayedData();
      }
    }*/
    updateDisplayedData() {
      console.log("3- Entrou no updateDisplayedData");
      const start: number = this.currentPage * this.size;
      const end: number = start + Number(this.size);
      console.log("4- Valores de start: ", start, " e end: ", end);
      this.displayedData = this.data.slice(start, end);
      this.sortData();
      console.log("5- Novo displayedData: ", this.displayedData);
    }

    onLoadMore(): void {//event: any
      //this.currentPage = event.page;

      if ((this.currentPage + 1) * this.size > this.data.length) {
        this.buscar(this.numeroProcesso, this.codigoClasse, this.codigoOrgaoJulgador, this.size, this.nextTrf, this.sortValue);
      } else {
        this.updateDisplayedData();
      }
    }

    onPageChange(event: any): void {
      const previousPage = this.currentPage;
      this.currentPage = event.page;

      if (this.currentPage < previousPage) {
        console.log("2- Chamou updateDisplayedData");
        //this.goBackPaginator();
        this.updateDisplayedData();
      } else {
        console.log("Carregando mais dados da API...");
        this.onLoadMore();//event
      }
    }

    goBackPaginator(): void {
      console.log("CURRENT PAGE: ", this.currentPage);
      if (this.currentPage >= 0) {
        console.log("entrou no goBackPaginator");
        this.currentPage--;
        this.updateDisplayedData();
      }
    }

    /*
  onLoadMore(event: any): void {
    // Implemente aqui a lógica para carregar mais resultados

    console.log("Botão para continuar busca ativado...");
    this.buscar(this.numeroProcesso, this.codigoClasse, this.codigoOrgaoJulgador, this.size, this.nextTrf, this.searchAfter);
  }
    */

  onVisualizeDetails(id: string){
    this.navigationContextService.setSourceComponent("search-results");
    this.router.navigate(['/process-details/', id]);
  }

  turnOnNotifications(processo: any) {
    if(this.authService.checkAuthentication()){
      this.notificationService.saveProcess(processo._source).subscribe({
        next: () => {
          this.notificationStates[processo._source.id] = true;
          this.showEnableNotification();
        },
        error: error => {
          console.error('Erro ao ativar a notificação:  ', error);
          this.showErrorNotification(error);
        }
      });
    } else {
      this.authService.irPaginaLogin();
    }
  }

  turnOffNotifications(processo: any) {
    if(this.authService.checkAuthentication()){
      this.notificationService.removeProcess(processo._source.id).subscribe({
        next: () => {
          this.notificationStates[processo._source.id] = false;
          this.showDisableNotification();
        },
        error: error => {
          console.error('Erro ao desativar a notificação: ', error);
          this.showErrorNotification(error);
        }
      });
    }else {
      this.authService.irPaginaLogin();
    }

  }

  loadActiveNotifications() {
    this.notificationService.getActiveNotifications().subscribe({
      next: (response) => {
        console.log("loadActiveNotifications: ", response);
        response.forEach((item: any) => {
          const identificador = item.identificador;
          this.notificationStates[identificador] = true;
          console.log("Processo com identificador: ", identificador, " já foi adicionado nas notificações");
        });
      },
      error: error => {
        console.error('Erro ao carregar notificações ativas', error);
      }
    });
  }

  isNotificationActiveProcess(processoId: string): boolean {
    return this.notificationStates[processoId] || false;
  }

  toggleNotifications(processo: any) {
    this.isNotificationActiveProcess(processo._source.id) ? this.confirmeRemoveNotification(processo) : this.turnOnNotifications(processo);
  }

  confirmeRemoveNotification(processo: any) {
    this.confirmationService.confirm({
        message: "Deseja realmente DESABILITAR a notificação deste processo?",
        header: 'Confirmação',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
            this.turnOffNotifications(processo);
        }
    });
  }

  /*
  sortData() {
    if (this.selectedSortOrder === 'asc') {
      this.data.sort((a, b) => new Date(a._source.movimentos[a._source.movimentos.length - 1].dataHora).getTime() - new Date(b._source.movimentos[b._source.movimentos.length - 1].dataHora).getTime());
    } else {
      this.data.sort((a, b) => new Date(b._source.movimentos[b._source.movimentos.length - 1].dataHora).getTime() - new Date(a._source.movimentos[a._source.movimentos.length - 1].dataHora).getTime());
    }
  }
*/
  sortData() {
    if (this.selectedSortOrder === 'asc') {
      this.displayedData.sort((a, b) => {
        const aLastMovement = a._source.movimentos && a._source.movimentos.length > 0 ? a._source.movimentos[a._source.movimentos.length - 1].dataHora : null;
        const bLastMovement = b._source.movimentos && b._source.movimentos.length > 0 ? b._source.movimentos[b._source.movimentos.length - 1].dataHora : null;

        if (!aLastMovement && !bLastMovement) return 0;
        if (!aLastMovement) return 1;
        if (!bLastMovement) return -1;

        return new Date(aLastMovement).getTime() - new Date(bLastMovement).getTime();
      });
    } else {
      this.displayedData.sort((a, b) => {
        const aLastMovement = a._source.movimentos && a._source.movimentos.length > 0 ? a._source.movimentos[a._source.movimentos.length - 1].dataHora : null;
        const bLastMovement = b._source.movimentos && b._source.movimentos.length > 0 ? b._source.movimentos[b._source.movimentos.length - 1].dataHora : null;

        if (!aLastMovement && !bLastMovement) return 0;
        if (!aLastMovement) return 1;
        if (!bLastMovement) return -1;

        return new Date(bLastMovement).getTime() - new Date(aLastMovement).getTime();
      });
    }
  }

  onSortChange(event: any) {
    this.selectedSortOrder = event.value;
    this.sortData();
  }

  goBack(): void {
    this.location.back();
  }

  showEnableNotification() {
    this.messageService.add({ severity: 'success', summary: this.titleEnableNotification, detail: this.messageEnableNotification });
  }

  showDisableNotification() {
    this.messageService.add({ severity: 'warn', summary: this.titleDisableNotification, detail: this.messageDisableNotification});
  }

  showErrorNotification(error: string) {
    this.messageService.add({ severity: 'error', summary: this.titleErrorNotification, detail: this.messageErrorNotification + " Erro: " + error});
  }

}
