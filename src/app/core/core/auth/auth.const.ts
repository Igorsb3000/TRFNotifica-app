import { Routes } from '@angular/router';
import { NotFoundComponent } from '../../../pages/not-found/not-found.component';


export class AuthConst {
  static readonly PAGINA_LOGIN   = '/login';
  static readonly END_POINT_TOKEN = '/token';
  static readonly PAGINA_INICIAL = '/search';

  static readonly routesMininal: Routes = [
    // Pagina principal
    { path: '', redirectTo: 'search', pathMatch: 'full' },
    { path: 'not-found', component: NotFoundComponent },
    {
      path: 'login',
      loadChildren: () => import('../../../pages/login/login.module').then(m => m.LoginModule)
    },
    {
      path: 'cadastre',
      loadChildren: () => import('../../../pages/user-form/user-form.module').then(m => m.UserFormModule)
    },

  ]
}
