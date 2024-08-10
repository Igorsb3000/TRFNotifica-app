import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root'
})
export class ErroService {

  constructor(
    private authService: AuthService,
    private messageService: MessageService,
  ) { }

  private showError(msg: string) {
    this.messageService.add({
      severity: 'error',
      summary: 'Erro',
      detail: msg,
      life: 5000,
    });
  }

  public handler(error: any): void {
    if (error.promise && error.rejection) {
      error = error.rejection;
    }

    if (error instanceof HttpErrorResponse) {
      if (!navigator.onLine) {
        this.showError('Sem conexão com a Internet. Por favor verifique sua internet para continuar.');
      } else {
        this.handleHttpError(error);
      }
    } else {
      this.showError(error.message);
    }
  }

  private handleHttpError(error: HttpErrorResponse) {
    const errorMessage = error.error?.message || error.error?.erro || null;
    if (errorMessage) {
      this.showError(errorMessage);
      return;
    }

    const errorMessages: { [key: number]: string } = {
      0: 'O servidor não está respondendo.',
      400: 'Requisição mal formatada ou incorreta.',
      401: 'Sua sessão expirou. Por favor, faça login novamente.',
      403: 'Acesso Negado.',
      404: 'Página não encontrada.',
      405: 'Método não permitido. Verifique a solicitação e tente novamente.',
      406: 'Dados inválidos. Verifique os dados fornecidos e tente novamente.',
      408: 'Tempo limite da requisição atingido. Por favor, tente novamente.',
      410: 'Recurso solicitado não está mais disponível.',
      429: 'Muitas solicitações. Por favor, aguarde um momento e tente novamente.',
      500: 'Erro interno no Servidor.',
      502: 'Gateway incorreto. Por favor, tente novamente.',
      503: 'Serviço temporariamente indisponível. Por favor, tente novamente mais tarde.',
      504: 'Tempo limite do gateway atingido. Por favor, tente novamente.'
    };

    const defaultMessage = 'Ocorreu um erro inesperado.';

    this.showError(errorMessages[error.status] || defaultMessage);

    if (error.status === 401) {
      this.authService.irPaginaLogin();
    }
  }

}
