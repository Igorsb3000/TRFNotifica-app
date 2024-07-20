import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AuthConst } from "./core/core/auth.const";
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
      { path: 'search-results',
        loadChildren: () => import('./features/search-results/search-results.module').then(m => m.SearchResultsModule)
      },
      {
        path:'process-details/:id',
        loadChildren:() => import('./features/process-details/process-details.module').then(m => m.ProcessDetailsModule)
      },
      {
        path:'my-processes',
        loadChildren:() => import('./features/my-processes/my-processes.module').then(m => m.MyProcessesModule)
      },
      {
        path:'profile',
        loadChildren:() => import('./features/profile/profile.module').then(m => m.ProfileModule)
      }
    ]
  },
  { path: '**', redirectTo: 'nao-encontrada' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
