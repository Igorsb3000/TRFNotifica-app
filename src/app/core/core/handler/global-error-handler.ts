import { ErrorHandler, Injectable } from '@angular/core';
import { ErroService } from '../../../../../src/app/services/erro.service';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {

  constructor(private erroService: ErroService) {}

  handleError(error: any): void {
    this.erroService.handler(error);
  }
}
