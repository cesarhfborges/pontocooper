import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DevelopmentPage } from './development.page';

const routes: Routes = [
  {
    path: '',
    component: DevelopmentPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DevelopmentPageRoutingModule {}
