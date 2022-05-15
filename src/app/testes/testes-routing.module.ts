import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TestesPage } from './testes.page';

const routes: Routes = [
  {
    path: '',
    component: TestesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TestesPageRoutingModule {}
