import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { AuthService } from '../../features/auth/auth/auth.service';
import { Subscription } from 'rxjs';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.css'
})
export class MainLayoutComponent implements OnInit{
  private isAuthenticated: boolean = false;
  private authSubscription: Subscription | undefined;
  public menuItens: MenuItem[]= [];

  constructor(private authService: AuthService){}

  ngOnInit() {
    this.authSubscription = this.authService.isAuthenticated$.subscribe(isAuthenticated => {
      this.isAuthenticated = isAuthenticated;
      this.updateMenuItems();
    });
  }

  ngOnDestroy() {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }

  updateMenuItems() {
    this.menuItens = [
      { label: 'Busca', icon: 'pi pi-fw pi-search', ariaLabel: 'Buscar', routerLink: ['/search']},
      { label: 'Meus processos', icon: 'pi pi-fw pi-bell', ariaLabel: 'Meus processos', routerLink: this.isAuthenticated ? ['/my-processes'] : ['/login']},
      { label: 'Perfil', icon: 'pi pi-fw pi-user', ariaLabel: 'Perfil', routerLink: this.isAuthenticated ?['/profile'] : ['/login']}
    ];

    if (this.isAuthenticated) {
      this.menuItens.push({ label: 'Sair', icon: 'pi pi-fw pi-sign-out', ariaLabel: 'Sair', command: () => this.logout() });
    }
  }

  logout() {
    this.authService.logout();
    this.isAuthenticated = false;
    this.updateMenuItems();
  }

}
