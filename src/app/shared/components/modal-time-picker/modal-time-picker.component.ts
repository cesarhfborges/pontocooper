import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-modal-time-picker',
  templateUrl: './modal-time-picker.component.html',
  styleUrls: ['./modal-time-picker.component.scss'],
})
export class ModalTimePickerComponent  implements OnInit {

  @Input() horaSelecionada = '';

  constructor(
    private modalCtrl: ModalController
  ) { }

  ngOnInit() {}

  cancel() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }

  confirm() {
    return this.modalCtrl.dismiss(this.horaSelecionada, 'confirm');
  }
}
