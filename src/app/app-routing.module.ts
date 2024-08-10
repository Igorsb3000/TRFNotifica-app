import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AuthConst } from "../app/core/core/auth/auth.const";
import { MainLayoutComponent } from "./core/main-layout/main-layout.component";
import { AuthGuard } from "./core/core/auth/auth.guard";

const routes: Routes = [
  ...AuthConst.routesMininal,
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      {
        path: 'search',
        loadChildren: () => import('./pages/search/search.module').then(m => m.SearchModule)
      },
      { path: 'search-results',
        loadChildren: () => import('./pages/search-results/search-results.module').then(m => m.SearchResultsModule)
      },
      {
        path:'process-details/:id',
        loadChildren:() => import('./pages/process-details/process-details.module').then(m => m.ProcessDetailsModule)
      },
      {
        path:'my-processes',
        loadChildren:() => import('./pages/my-processes/my-processes.module').then(m => m.MyProcessesModule),
        canActivate: [AuthGuard]
      },
      {
        path:'profile',
        loadChildren:() => import('./pages/profile/profile.module').then(m => m.ProfileModule),
        canActivate: [AuthGuard]
      }
    ]
  },
  { path: '**', redirectTo: 'not-found' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
