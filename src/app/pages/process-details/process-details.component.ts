import { NavigationContextService } from '../../../../src/app/services/navigation-context.service';
import { Component, ErrorHandler } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SearchService } from '../../services/search.service';
import { Location } from '@angular/common';
import { NotificationService } from '../../../../src/app/services/notification.service';
import { AuthService } from '../../services/auth.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { EMessages } from '../../enum/messages.enum';
import { ErroService } from '../../../../src/app/services/erro.service';

@Component({
  selector: 'app-process-details',
  templateUrl: './process-details.component.html',
  styleUrl: './process-details.component.css',
  providers: [ConfirmationService, MessageService]
})
export class ProcessDetailsComponent {
  processo: any;
  isLoading: boolean = false;
  movimentacoes: any[] = []; // Armazena os dados brutos
  identificador: string = "";
  classeNome: string = "";
  classeCodigo: number = 0;
  numeroProcesso: string = "";
  dataAjuizamento: string = "";
  tribunal: string = "";
  grau: string = "";
  assuntos: any[] = [];
  orgaoJulgadorNome: string = "";
  orgaoJulgadorCodigo: number = 0;
  sistemaNome: string = "";
  paginatedData: any[] = []; // Dados a serem exibidos na página atual
  totalRecords: number = 0;
  itemsPerPage: number = 1; // Número de itens por página
  currentPage: number = 1; // Página atual
  notificationStates: { [id: string]: boolean } = {}; // Estados de notificação para cada processo
  titleErrorNotification: string = EMessages.titleErrorNotification;
  titleEnableNotification: string = EMessages.titleEnableNotification;
  titleDisableNotification: string = EMessages.titleDisableNotification;
  messageErrorNotification: string = EMessages.messageErrorNotification;
  messageEnableNotification: string = EMessages.messageEnableNotification;
  messageDisableNotification: string = EMessages.messageDisableNotification;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private searchService: SearchService,
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

    if(this.navigationContextService.getSourceComponent() === "search-results"){
      this.isLoading = true;
      this.route.params.subscribe(params => {
        const processoId = params['id'];
        this.searchService.getByIdentificador(processoId).subscribe({
          next: response => {
            this.isLoading = false;
            this.processo = response[0]._source;
            this.identificador = this.processo?.id; // Identificador do processo
            this.classeNome = this.processo?.classe.nome;
            this.classeCodigo = this.processo?.classe.codigo;
            this.numeroProcesso = this.processo?.numeroProcesso;
            this.dataAjuizamento = this.processo?.dataAjuizamento;
            this.assuntos = this.processo?.assuntos;
            this.tribunal = this.processo?.tribunal;
            this.grau = this.processo?.grau;
            this.orgaoJulgadorNome = this.processo?.orgaoJulgador.nome;
            this.orgaoJulgadorCodigo = this.processo?.orgaoJulgador.codigo;
            this.sistemaNome = this.processo?.sistema.nome;
            this.movimentacoes = this.processo?.movimentos ?? []; // Obtém os dados dos movimentos
            this.movimentacoes.reverse(); // Inverte a ordem
            this.totalRecords = this.movimentacoes.length;
            this.updatePaginatedData();
          }
        });
      });
      } else if(this.navigationContextService.getSourceComponent() === "my-processes") {
        this.isLoading = true;
        this.route.params.subscribe(params => {
        const processoId = params['id'];
        this.searchService.getByIdentificadorLocal(processoId).subscribe({
          next: response => {
            this.isLoading = false;
            this.processo = response;
            this.identificador = this.processo?.identificador; // Identificador do processo
            this.classeCodigo = this.processo?.classeCodigo;
            this.classeNome = this.processo?.classeNome;
            this.numeroProcesso = this.processo?.numero;
            this.dataAjuizamento = this.processo?.dataAjuizamento;
            this.assuntos = this.processo?.assuntos;
            this.tribunal = this.processo?.tribunal;
            this.grau = this.processo?.grau;
            this.orgaoJulgadorCodigo = this.processo?.orgaoJulgadorCodigo;
            this.orgaoJulgadorNome = this.processo?.orgaoJulgadorNome;
            this.sistemaNome = this.processo?.sistemaNome;
            this.movimentacoes = this.processo.movimentacoes ?? []; // Obtém os dados dos movimentos
            this.movimentacoes.reverse(); // Inverte a ordem
            this.totalRecords = this.movimentacoes.length;
            this.updatePaginatedData();
          }
        });
      });
      this.messageService.add({ severity: 'success', summary: 'Test', detail: 'This is a test message' });
    }
  }

  updatePaginatedData(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedData = this.movimentacoes.slice(startIndex, endIndex);
  }

  onPageChange(event: any): void {
    this.currentPage = event.page + 1; // O paginator começa com a página 0
    this.updatePaginatedData();
  }

  toggleNotifications(processo: any) {
    if(processo.identificador){
      this.isNotificationActiveProcess(processo.identificador) ? this.confirmeRemoveNotification(processo) : this.turnOnNotifications(processo);
    } else {
      this.isNotificationActiveProcess(processo.id) ? this.confirmeRemoveNotification(processo) : this.turnOnNotifications(processo);
    }

  }

  isNotificationActiveProcess(processoId: string): boolean {
    return this.notificationStates[processoId] || false;
  }

  turnOnNotifications(processo: any) {
    if(this.authService.checkAuthentication()){
      this.notificationService.saveProcess(processo).subscribe({
        next: () => {
          if(processo.identificador){
            this.notificationStates[processo.identificador] = true;
          } else {
            this.notificationStates[processo.id] = true;
          }
          this.loadActiveNotifications();
          this.showEnableNotification();
        }
      });
    } else {
      this.authService.irPaginaLogin();
    }
  }

  turnOffNotifications(processo: any) {
    if(this.authService.checkAuthentication()){
      this.notificationService.removeProcess(processo.identificador).subscribe({
        next: () => {
          if(processo.identificador != null && processo.identificador != undefined){
            this.notificationStates[processo.identificador] = false;
            this.identificador = processo.identificador;
          } else {
            this.notificationStates[processo.id] = false;
            this.identificador = processo.id;
          }
          this.showDisableNotification();
          this.searchService.getByIdentificador(this.identificador).subscribe({
            next: response => {
              this.processo = response[0]._source;
            }
          });
        }
      });
    }else {
      this.authService.irPaginaLogin();
    }

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

  loadActiveNotifications() {
    this.notificationService.getActiveNotifications().subscribe({
      next: (response) => {
        response.forEach((item: any) => {
          const identificador = item.identificador ? item.identificador : item.id;
          this.notificationStates[identificador] = true;
        });
      }
    });
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
