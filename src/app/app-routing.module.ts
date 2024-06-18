import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AuthConst } from "./core/core/auth.const";
import { LoginComponent } from "./features/auth/login/login.component";
import { MainLayoutComponent } from "./core/main-layout/main-layout.component";

const routes: Routes = [
  ...AuthConst.routesMininal,
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      {
        path: 'search',
        loadChildren: () => import('./features/search/search.module').then(m => m.SearchModule),
        //canActivate: [AuthGuard]
      },
      { path: 'search-results', loadChildren: () => import('./features/search-results/search-results.module').then(m => m.SearchResultsModule) }
    ]
  },
  { path: '**', redirectTo: 'nao-encontrada' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
