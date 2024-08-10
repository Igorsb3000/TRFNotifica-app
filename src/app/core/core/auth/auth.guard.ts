import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';


@Injectable({
  providedIn: 'root'
})
export class AuthGuard {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {
    if (this.authService.checkAuthentication()) {
      return true;
    } else {
      this.authService.setRedirectUrl(state.url); // Armazena a URL atual
      this.router.navigate(['/login']);
      return false;
    }
  }
}

