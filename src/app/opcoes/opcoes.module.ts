import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OpcoesPageRoutingModule } from './opcoes-routing.module';

import { OpcoesPage } from './opcoes.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    OpcoesPageRoutingModule
  ],
  declarations: [OpcoesPage]
})
export class OpcoesPageModule {}
