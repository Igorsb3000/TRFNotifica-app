import { ChangeDetectorRef, Component, NgZone, OnInit, OnDestroy, AfterViewChecked } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Subscription } from 'rxjs';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.css']
})
export class MainLayoutComponent implements OnInit, OnDestroy, AfterViewChecked {
  private isAuthenticated: boolean = false;
  private authSubscription: Subscription | undefined;
  public menuItens: MenuItem[] = [];
  private updateMenu: boolean = false;

  constructor(
    private authService: AuthService,
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone
  ) {}

  ngOnInit() {
    this.authSubscription = this.authService.isAuthenticated$.subscribe(isAuthenticated => {
      this.ngZone.run(() => {
        this.isAuthenticated = isAuthenticated;
        this.updateMenu = true;
      });
    });
  }

  ngOnDestroy() {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }

  ngAfterViewChecked() {
    if (this.updateMenu) {
      this.updateMenuItems();
      this.updateMenu = false;

      // Remove o atributo aria-level dos elementos (garantir 100% acessibilidade)
      const menuItems = document.querySelectorAll('[aria-level="1"]');
      menuItems.forEach(item => {
        item.removeAttribute('aria-level');
      });
    }
  }

  updateMenuItems() {
    this.menuItens = [
      { label: 'Consulta', icon: 'pi pi-fw pi-search', routerLink: ['/search'] },
      { label: 'Meus processos', icon: 'pi pi-fw pi-bell', routerLink: ['/my-processes'] },
      { label: 'Perfil', icon: 'pi pi-fw pi-user',  routerLink: ['/profile'] }
    ];

    if (this.isAuthenticated) {
      this.menuItens.push({ label: 'Sair', icon: 'pi pi-fw pi-sign-out', command: () => this.logout() });
    } else {
      this.menuItens.push({ label: 'Login', icon: 'pi pi-fw pi-sign-in', routerLink: ['/login'] });
    }

    this.cdr.detectChanges();
  }

  logout() {
    this.authService.logout();
    this.ngZone.run(() => {
      this.isAuthenticated = false;
      this.updateMenu = true;
    });
  }
}
