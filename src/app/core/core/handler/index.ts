import { ErrorHandler } from '@angular/core';
import { GlobalErrorHandler } from './global-error-handler';

export const errorProviders = [
  { provide: ErrorHandler, useClass: GlobalErrorHandler },
];
