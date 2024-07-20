import { NavigationContextService } from './../../../shared/services/navigation-context.service';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SearchService } from '../search.service';
import { Location } from '@angular/common';
import { NotificationService } from '../../../shared/services/notification.service';
import { AuthService } from '../auth/auth/auth.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { EMessages } from '../enum/messages.enum';

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
          },
          error: error => {
            this.isLoading = false;
            console.error('Erro ao buscar processo de Id= ', processoId, ": ", error);
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
          },
          error: error => {
            this.isLoading = false;
            console.error('Erro ao buscar processo de Id= ', processoId, ": ", error);
          }
        });
      });
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
    console.log("toggle: ", processo);
    console.log("toggle 2 ", processo.id);
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
        },
        error: error => {
          console.error('Erro ao salvar o processo', error);
          this.showErrorNotification(error);
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
            },
            error: error => {
              this.isLoading = false;
              console.error("Erro ao buscar processo. Erro: ", error);
            }
          });
        },
        error: error => {
          console.error('Erro ao desativar a notificação', error);
          this.showErrorNotification(error);
        }
      });
    }else {
      this.authService.irPaginaLogin();
    }

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

  loadActiveNotifications() {
    this.notificationService.getActiveNotifications().subscribe({
      next: (response) => {
        console.log("loadActiveNotifications: ", response);
        response.forEach((item: any) => {
          const identificador = item.identificador ? item.identificador : item.id;
          this.notificationStates[identificador] = true;
          console.log("Processo com identificador: ", identificador, " já foi adicionado nas notificações");
        });
      },
      error: error => {
        console.error('Erro ao carregar notificações ativas', error);
      }
    });
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
