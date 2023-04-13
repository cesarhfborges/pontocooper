import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MainLayoutComponent} from './layouts/main-layout/main-layout.component';
import {IonicModule} from '@ionic/angular';
import {RouterLink, RouterLinkActive} from '@angular/router';
import {InvalidMessageComponent} from './components/invalid-message/invalid-message.component';
import {InputPasswordToggleComponent} from './components/input-password-toggle/input-password-toggle.component';
import {LoadingTextComponent} from './components/loading-text/loading-text.component';

@NgModule({
  declarations: [
    MainLayoutComponent,
    InvalidMessageComponent,
    InputPasswordToggleComponent,
    LoadingTextComponent
  ],
  exports: [
    InvalidMessageComponent,
    InputPasswordToggleComponent,
    LoadingTextComponent
  ],
    imports: [
        IonicModule,
        CommonModule,
        RouterLink,
        RouterLinkActive
    ]
})
export class SharedModule { }
