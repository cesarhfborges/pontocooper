import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {FeriasAbonosPage} from './ferias-abonos.page';

const routes: Routes = [
  {
    path: '',
    component: FeriasAbonosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FeriasAbonosPageRoutingModule {}
