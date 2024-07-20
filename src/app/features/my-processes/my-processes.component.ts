import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NotificationService } from '../../../shared/services/notification.service';
import { AuthService } from '../auth/auth/auth.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { EMessages } from '../enum/messages.enum';
import { Location } from '@angular/common';import { NavigationContextService } from '../../../shared/services/navigation-context.service';
;

@Component({
  selector: 'app-my-processes',
  templateUrl: './my-processes.component.html',
  styleUrl: './my-processes.component.css',
  providers: [ConfirmationService, MessageService]
})
export class MyProcessesComponent {
  data: any[] = [];
  sortValue?: number;
  isLoading: boolean = false;
  notificationStates: { [id: string]: boolean } = {}; // Estados de notificação para cada processo
  numeroProcesso:string = "";
  codigoClasse: number = 0;
  codigoOrgaoJulgador: number = 0;
  size: number = 0;
  nextTrf: number = 0;
  searchAfter:number = 0;
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
      this.loadData();
    } else {
      this.authService.irPaginaLogin();
    }
  }

  loadData(){
    this.notificationService.getActiveNotifications().subscribe({
      next: response => {
        this.data = response;
        console.log("Load Data: ", this.data);
        this.data.forEach((processo: any) => {
          this.notificationStates[processo.identificador] = true;
          console.log("Processo com identificador: ", processo.identificador, " já foi adicionado nas notificações");
        });
        console.log("Processos Salvos pelo Usuário: " + response);
        this.sortData();
      },
      error: error =>{
        console.error('Erro ao buscar processos', error);
      }

    });
  }


  onVisualizeDetails(identificador: string){
    this.navigationContextService.setSourceComponent("my-processes");
    this.router.navigate(['/process-details/', identificador]);
  }

  loadActiveNotifications() {
    this.data.forEach((processo: any) => {
      const identificador = processo.id;
      this.notificationStates[identificador] = true;
      console.log("Processo com identificador: ", identificador, " já foi adicionado nas notificações");
    });
  }

  turnOffNotifications(processo: any) {
    if(this.authService.checkAuthentication()){
      console.log("PROCESSO ENVIADO: ", processo);
      this.notificationService.removeProcess(processo.identificador).subscribe({
        next: () => {
          this.notificationStates[processo.identificador] = false;
          this.showDisableNotification();
          this.loadData();
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

  isNotificationActiveProcess(processoId: string): boolean {
    return this.notificationStates[processoId] || false;
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

  goBack(): void {
    this.location.back();
  }

  onSortChange(event: any) {
    this.selectedSortOrder = event.value;
    this.sortData();
  }

  sortData() {
    if (this.selectedSortOrder === 'asc') {
      this.data.sort((a, b) => {
        const aLastMovement = a.movimentacoes && a.movimentacoes.length > 0 ? a.movimentacoes[a.movimentacoes.length - 1].dataHora : null;
        const bLastMovement = b.movimentacoes && b.movimentacoes.length > 0 ? b.movimentacoes[b.movimentacoes.length - 1].dataHora : null;

        if (!aLastMovement && !bLastMovement) return 0;
        if (!aLastMovement) return 1;
        if (!bLastMovement) return -1;

        return new Date(aLastMovement).getTime() - new Date(bLastMovement).getTime();
      });
    } else {
      this.data.sort((a, b) => {
        const aLastMovement = a.movimentacoes && a.movimentacoes.length > 0 ? a.movimentacoes[a.movimentacoes.length - 1].dataHora : null;
        const bLastMovement = b.movimentacoes && b.movimentacoes.length > 0 ? b.movimentacoes[b.movimentacoes.length - 1].dataHora : null;

        if (!aLastMovement && !bLastMovement) return 0;
        if (!aLastMovement) return 1;
        if (!bLastMovement) return -1;

        return new Date(bLastMovement).getTime() - new Date(aLastMovement).getTime();
      });
    }
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
