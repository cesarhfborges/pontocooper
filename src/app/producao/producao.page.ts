import {Component, OnInit} from '@angular/core';
import {animate, query, stagger, style, transition, trigger} from '@angular/animations';
import {formatISO, parseISO, set, startOfMonth} from 'date-fns';
import {ModalController} from '@ionic/angular';
import {ModalDatePickerComponent} from '../shared/components/modal-date-picker/modal-date-picker.component';

@Component({
  selector: 'app-producao',
  templateUrl: './producao.page.html',
  styleUrls: ['./producao.page.scss'],
  animations: [
    trigger('slideOutAnimation', [
      transition('* => *', [
        query(':enter',
          style({opacity: 0, transform: 'translateX(30px)'}),
          {optional: true}
        ),
        query(':enter', stagger(100, [
          style({opacity: 0, transform: 'translateX(30px)'}),
          animate('700ms ease-in-out', style({opacity: 1, transform: 'translateX(0)'}))
        ]), {optional: true}),
      ])
    ])
  ]
})
export class ProducaoPage implements OnInit {

  dataSelecionada: Date = set(startOfMonth(new Date()), {hours: 0, minutes: 0, seconds: 0, milliseconds: 0});

  constructor(
    private modalCtrl: ModalController
  ) {
  }

  ngOnInit() {
    this.dataSelecionada = set(startOfMonth(new Date()), {hours: 0, minutes: 0, seconds: 0, milliseconds: 0});
  }

  async openModal() {
    const modal = await this.modalCtrl.create({
      component: ModalDatePickerComponent,
      cssClass: 'datePicker',
      componentProps: {dataSelecionada: formatISO(this.dataSelecionada)},
    });
    await modal.present();

    const {data, role} = await modal.onWillDismiss();

    if (role === 'confirm') {
      this.dataSelecionada = parseISO(data);
    }
  }
}
