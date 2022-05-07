import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PontoAutomaticoPage } from './ponto-automatico.page';

const routes: Routes = [
  {
    path: '',
    component: PontoAutomaticoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PontoAutomaticoPageRoutingModule {}
