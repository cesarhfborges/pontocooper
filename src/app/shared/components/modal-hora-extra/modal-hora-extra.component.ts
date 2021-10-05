import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {ModalController} from '@ionic/angular';

@Component({
  selector: 'app-modal-hora-extra',
  templateUrl: './modal-hora-extra.component.html',
  styleUrls: ['./modal-hora-extra.component.scss'],
  encapsulation: ViewEncapsulation.ShadowDom
})
export class ModalHoraExtraComponent implements OnInit {

  constructor(
    private modalController: ModalController
  ) {
  }

  ngOnInit() {
  }

  cancelar(): void {
    this.modalController.dismiss({
      success: false
    });
  }

  salvar(): void {
    this.modalController.dismiss({
      success: true,
      data: {teste: true}
    });
  }
}
