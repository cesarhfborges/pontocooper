import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OpcoesPage } from './opcoes.page';

const routes: Routes = [
  {
    path: '',
    component: OpcoesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OpcoesPageRoutingModule {}
