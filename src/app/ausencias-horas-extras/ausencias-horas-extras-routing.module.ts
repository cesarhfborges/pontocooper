import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AusenciasHorasExtrasPage } from './ausencias-horas-extras.page';

const routes: Routes = [
  {
    path: '',
    component: AusenciasHorasExtrasPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AusenciasHorasExtrasPageRoutingModule {}
