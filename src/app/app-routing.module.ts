import {NgModule} from '@angular/core';
import {PreloadAllModules, RouterModule, Routes} from '@angular/router';
import {AuthGuardService} from './core/guards/auth-guard.service';
import {MainLayoutComponent} from './shared/layouts/main-layout/main-layout.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [AuthGuardService],
    canActivateChild: [AuthGuardService],
    children: [
      {
        path: 'home',
        loadChildren: () => import('./home/home.module').then(m => m.HomePageModule),
      },
      {
        path: 'producao',
        loadChildren: () => import('./producao/producao.module').then( m => m.ProducaoPageModule)
      },
      {
        path: 'profile',
        loadChildren: () => import('./profile/profile.module').then( m => m.ProfilePageModule)
      },
      {
        path: 'historico',
        loadChildren: () => import('./historico/historico.module').then( m => m.HistoricoPageModule)
      },
      {
        path: 'development',
        loadChildren: () => import('./development/development.module').then( m => m.DevelopmentPageModule)
      },
    ]
  },
  {
    path: 'login',
    canActivate: [AuthGuardService],
    canActivateChild: [AuthGuardService],
    loadChildren: () => import('./login/login.module').then(m => m.LoginPageModule)
  },
  {
    path: '**',
    redirectTo: 'home',
    pathMatch: 'full'
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {preloadingStrategy: PreloadAllModules})
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
