import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { IonicModule } from '@ionic/angular';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { InvalidMessageComponent } from './components/invalid-message/invalid-message.component';
import { InputPasswordToggleComponent } from './components/input-password-toggle/input-password-toggle.component';
import { LoadingTextComponent } from './components/loading-text/loading-text.component';
import { OpenLayersComponent } from './components/open-layers/open-layers.component';
import { ModalDatePickerComponent } from './components/modal-date-picker/modal-date-picker.component';
import { ModalRasuraComponent } from './components/modal-rasura/modal-rasura.component';
import { PreventFocusDirective } from './directives/prevent-focus.directive';
import { ModalTimePickerComponent } from './components/modal-time-picker/modal-time-picker.component';
import { SlideUnlockComponent } from './components/slide-unlock/slide-unlock.component';
import { SlideEventsDirective } from './components/slide-unlock/directives/slide-events.directive';

@NgModule({
  declarations: [
    MainLayoutComponent,
    InvalidMessageComponent,
    InputPasswordToggleComponent,
    LoadingTextComponent,
    OpenLayersComponent,
    ModalDatePickerComponent,
    ModalTimePickerComponent,
    ModalRasuraComponent,
    PreventFocusDirective,
    SlideUnlockComponent,
    SlideEventsDirective,
  ],
  exports: [
    InvalidMessageComponent,
    InputPasswordToggleComponent,
    LoadingTextComponent,
    OpenLayersComponent,
    ModalDatePickerComponent,
    ModalRasuraComponent,
    PreventFocusDirective,
    SlideUnlockComponent
  ],
  imports: [
    IonicModule,
    CommonModule,
    RouterLink,
    RouterLinkActive,
    FormsModule,
    ReactiveFormsModule,
  ],
})
export class SharedModule {
}
