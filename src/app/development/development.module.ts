import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DevelopmentPageRoutingModule } from './development-routing.module';

import { DevelopmentPage } from './development.page';
import { SharedModule } from '../shared/shared.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        DevelopmentPageRoutingModule,
        SharedModule,
    ],
  declarations: [DevelopmentPage]
})
export class DevelopmentPageModule {}
