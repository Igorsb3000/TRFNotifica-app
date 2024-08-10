import { NotificationService } from '../../../../src/app/services/notification.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SearchService } from '../../services/search.service';
import { IBuscaProcessoRequestDTO } from '../../models/busca-processo-request-dto';
import { Location } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { EMessages } from '../../enum/messages.enum';
import { NavigationContextService } from '../../../../src/app/services/navigation-context.service';


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
  notificationStates: { [id: string]: boolean } = {}; // Estados de notificacao para cada processo
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

      this.searchService.search(buscaProcesso, size, nextTrf, searchAfter).subscribe({
        next: response => {
          this.isLoading = false;
          this.data = [...this.data, ...response.data];
          this.sortValue = response?.sortValue;
          this.nextTrf = response?.nextTrf;
          this.totalResults = response?.totalResults;
          this.updateDisplayedData();
        }
      });
    }

    updateDisplayedData() {
      const start: number = this.currentPage * this.size;
      const end: number = start + Number(this.size);
      this.displayedData = this.data.slice(start, end);
      this.sortData();
    }

    onLoadMore(): void {
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
        this.updateDisplayedData();
      } else {
        this.onLoadMore();
      }
    }

    goBackPaginator(): void {
      if (this.currentPage >= 0) {
        this.currentPage--;
        this.updateDisplayedData();
      }
    }


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
        }
      });
    }else {
      this.authService.irPaginaLogin();
    }

  }

  loadActiveNotifications() {
    this.notificationService.getActiveNotifications().subscribe({
      next: (response) => {
        response.forEach((item: any) => {
          const identificador = item.identificador;
          this.notificationStates[identificador] = true;
        });
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
        message: "Deseja realmente <strong>DESABILITAR</strong> a notificação deste processo?",
        header: 'Confirmação',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
            this.turnOffNotifications(processo);
        }
    });
    // Adiciona um delay para garantir que o confirmDialog esteja completamente renderizado
    // Adiciona os aria-labels para melhorar acessibilidade
    setTimeout(() => {
      this.addAriaLabels();
    }, 100);
  }

  addAriaLabels() {
    const dialog = document.querySelector('.p-confirm-dialog');
    if (dialog) {
      const headerButton = dialog.querySelector('.p-dialog-header');
      const messageButton = dialog.querySelector('.p-confirm-dialog-message');
      const acceptButton = dialog.querySelector('.p-confirm-dialog-accept');
      const rejectButton = dialog.querySelector('.p-confirm-dialog-reject');

      if(headerButton){
        headerButton.setAttribute('aria-label', 'Confirmação');
      }

      if(messageButton){
        messageButton.setAttribute('aria-label', 'Deseja realmente DESABILITAR a notificação deste processo?');
      }

      if (acceptButton) {
        acceptButton.setAttribute('aria-label', 'Sim');
      }

      if (rejectButton) {
        rejectButton.setAttribute('aria-label', 'Não');
      }
    }
  }


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

  formatProcessNumber(value: string): string {
    if (!value) {
      return value;
    }

    return value.replace(
      /(\d{7})(\d{2})(\d{4})(\d{1})(\d{2})(\d{4})/,
      '$1-$2.$3.$4.$5.$6'
    );
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

}
