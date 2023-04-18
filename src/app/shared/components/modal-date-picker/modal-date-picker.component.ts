import {Component, Input, OnInit} from '@angular/core';
import {endOfMonth, formatISO, set, startOfMonth, subYears} from 'date-fns';
import {ModalController} from '@ionic/angular';

@Component({
  selector: 'app-modal-date-picker',
  templateUrl: './modal-date-picker.component.html',
  styleUrls: ['./modal-date-picker.component.scss'],
})
export class ModalDatePickerComponent implements OnInit {

  @Input() dataSelecionada = '';

  dtConfig: {
    max: string;
    min: string;
  } = {
    max: formatISO(endOfMonth(new Date())),
    min: formatISO(subYears(startOfMonth(new Date()), 5)),
  };

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
    return this.modalCtrl.dismiss(this.dataSelecionada, 'confirm');
  }
}
