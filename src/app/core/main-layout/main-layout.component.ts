import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../features/auth/auth/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.css'
})
export class MainLayoutComponent implements OnInit{

  isAuthenticated: boolean = false;
  menuItens: any[] = [];
  private authSubscription: Subscription | undefined;

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
      { label: 'Busca', icon: 'pi pi-fw pi-search', routerLink: ['/home'] },
      { label: 'Meus processos', icon: 'pi pi-fw pi-bell', routerLink: ['/products'] },
      { label: 'Perfil', icon: 'pi pi-fw pi-user', routerLink: ['/services'] }
    ];

    if (this.isAuthenticated) {
      this.menuItens.push({ label: 'Sair', icon: 'pi pi-fw pi-sign-out', command: () => this.authService.logout() });
    }
  }

}
