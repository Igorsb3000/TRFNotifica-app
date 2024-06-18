import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from '../../features/auth/auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard {

}
