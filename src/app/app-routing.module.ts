import {NgModule} from '@angular/core';
import {PreloadAllModules, RouterModule, Routes} from '@angular/router';
import {AuthGuardService} from './core/guards/auth-guard.service';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then(m => m.HomePageModule),
    canActivate: [AuthGuardService],
    canActivateChild: [AuthGuardService]
  },
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then(m => m.LoginPageModule),
    canActivate: [AuthGuardService],
    canActivateChild: [AuthGuardService]
  },
  {
    path: 'producao',
    loadChildren: () => import('./producao/producao.module').then(m => m.ProducaoPageModule),
    canActivate: [AuthGuardService],
    canActivateChild: [AuthGuardService]
  },
  {
    path: 'perfil',
    loadChildren: () => import('./perfil/perfil.module').then(m => m.PerfilPageModule),
    canActivate: [AuthGuardService],
    canActivateChild: [AuthGuardService]
  },
  {
    path: 'opcoes',
    loadChildren: () => import('./opcoes/opcoes.module').then(m => m.OpcoesPageModule),
    canActivate: [AuthGuardService],
    canActivateChild: [AuthGuardService]
  },
  {
    path: 'historico',
    loadChildren: () => import('./historico/historico.module').then(m => m.HistoricoPageModule),
    canActivate: [AuthGuardService],
    canActivateChild: [AuthGuardService]
  },
  {
    path: 'ferias-abonos',
    loadChildren: () => import('./ferias-abonos/ferias-abonos.module').then(m => m.FeriasAbonosPageModule),
    canActivate: [AuthGuardService],
    canActivateChild: [AuthGuardService]
  },
  {
    path: 'ausencias-horas-extras',
    loadChildren: () => import('./ausencias-horas-extras/ausencias-horas-extras.module').then(m => m.AusenciasHorasExtrasPageModule),
    canActivate: [AuthGuardService],
    canActivateChild: [AuthGuardService]
  },
  {
    path: 'ponto',
    loadChildren: () => import('./ponto-automatico/ponto-automatico.module').then(m => m.PontoAutomaticoPageModule)
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {preloadingStrategy: PreloadAllModules})
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
