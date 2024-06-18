import { Routes } from '@angular/router';

//import { NaoEncontradaComponent } from '../pages/nao-encontrada/nao-encontrada.component';

export class AuthConst {
  static readonly PAGINA_LOGIN   = '/login';
  static readonly END_POINT_TOKEN = '/token';
  static readonly PAGINA_INICIAL = '/search';

  static readonly routesMininal: Routes = [
    { path: '', redirectTo: 'search', pathMatch: 'full' },
    // Livre
    //{ path: 'nao-autorizado', component: NaoAutorizadoComponent },
    //{ path: 'nao-encontrada', component: NaoEncontradaComponent },
    {
      path: 'login',
      loadChildren: () => import('../../features/auth/login/login.module').then(m => m.LoginModule)
    },

  ]
}
