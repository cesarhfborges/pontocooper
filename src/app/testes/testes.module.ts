import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TestesPageRoutingModule } from './testes-routing.module';

import { TestesPage } from './testes.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TestesPageRoutingModule
  ],
  declarations: [TestesPage]
})
export class TestesPageModule {}
