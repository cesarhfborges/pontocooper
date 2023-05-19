import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { endOfMonth, formatISO, set, startOfMonth, subYears } from 'date-fns';

interface DateTimeConfig {min: string; max: string}

@Component({
  selector: 'app-modal-time-picker',
  templateUrl: './modal-time-picker.component.html',
  styleUrls: ['./modal-time-picker.component.scss'],
})
export class ModalTimePickerComponent  implements OnInit {

  @Input() horaSelecionada: Date = new Date();
  constructor(
    private modalCtrl: ModalController
  ) {
  }

  ngOnInit() {
  }

  cancel() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }

  confirm() {
    return this.modalCtrl.dismiss(this.horaSelecionada, 'confirm');
  }
}
