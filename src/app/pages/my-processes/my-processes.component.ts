import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NotificationService } from '../../../../src/app/services/notification.service';
import { AuthService } from '../../services/auth.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { EMessages } from '../../enum/messages.enum';
import { Location } from '@angular/common';
import { NavigationContextService } from '../../../../src/app/services/navigation-context.service';

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
  notificationStates: { [id: string]: boolean } = {}; // Estados de notificacaoo para cada processo
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
    this.loadData();
  }

  loadData(){
    this.notificationService.getActiveNotifications().subscribe({
      next: (response) => {
        this.data = response;
        this.data.forEach((processo: any) => {
          this.notificationStates[processo.identificador] = true;
        });
        this.sortData();
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
    });
  }

  turnOffNotifications(processo: any) {
    if(this.authService.checkAuthentication()){
      this.notificationService.removeProcess(processo.identificador).subscribe({
        next: () => {
          this.notificationStates[processo.identificador] = false;
          this.showDisableNotification();
          this.loadData();
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

  formatProcessNumber(value: string): string {
    if (!value) {
      return value;
    }

    return value.replace(
      /(\d{7})(\d{2})(\d{4})(\d{1})(\d{2})(\d{4})/,
      '$1-$2.$3.$4.$5.$6'
    );
  }

  showEnableNotification() {
    this.messageService.add({ severity: 'success', summary: this.titleEnableNotification, detail: this.messageEnableNotification });
  }

  showDisableNotification() {
    this.messageService.add({ severity: 'warn', summary: this.titleDisableNotification, detail: this.messageDisableNotification});
  }

}
