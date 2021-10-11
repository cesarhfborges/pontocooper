import {Component, OnInit} from '@angular/core';
import {DadosService} from '../core/services/dados.service';
import {AlertController, ModalController, Platform} from '@ionic/angular';
import {StatusBar} from '@ionic-native/status-bar/ngx';
import {AuthService} from '../core/services/auth.service';
import {Dia} from '../core/models/dia';
import {ModalRasuraComponent} from '../shared/components/modal-rasura/modal-rasura.component';
import {ModalHoraExtraComponent} from '../shared/components/modal-hora-extra/modal-hora-extra.component';
import {getMonth, getYear, parseISO, isSameDay} from 'date-fns';

@Component({
  selector: 'app-producao',
  templateUrl: './producao.page.html',
  styleUrls: ['./producao.page.scss'],
})
export class ProducaoPage implements OnInit {

  producao: Array<Dia>;

  dataAtual: Date = new Date();

  loading: {
    producao: boolean;
  } = {
    producao: false,
  };

  constructor(
    private dadosService: DadosService,
    private alertController: AlertController,
    private authService: AuthService,
    private platform: Platform,
    private statusBar: StatusBar,
    private modalController: ModalController
  ) {
  }

  ngOnInit() {
    this.getProducao();
  }

  getProducao(): void {
    this.loading.producao = true;
    const ano: number = getYear(this.dataAtual);
    const mes: number = getMonth(this.dataAtual);
    this.dadosService.getProducao(ano, mes + 1).subscribe(
      response => {
        this.producao = response;
        this.loading.producao = false;
      },
      error => {
        console.log(error);
        this.loading.producao = false;
      }
    );
  }

  async modalRasura(dia: Dia) {
    const modal = await this.modalController.create({
      component: ModalRasuraComponent,
      cssClass: 'my-custom-class',
      swipeToClose: true,
      backdropDismiss: false,
      keyboardClose: false,
      animated: true,
      componentProps: {
        dados: dia
      }
    });
    await modal.present();
    const {data} = await modal.onWillDismiss();
    if (data.success) {
      this.getProducao();
    }
  }

  async modalHoraExtra(dia: Dia) {
    const modal = await this.modalController.create({
      component: ModalHoraExtraComponent,
      cssClass: 'my-custom-class',
      swipeToClose: true,
      backdropDismiss: false,
      keyboardClose: false,
      animated: true,
      componentProps: {
        dados: dia
      }
    });
    await modal.present();
    const {data} = await modal.onWillDismiss();
    console.log(data);
  }

  formatDate(data: string): Date {
    return parseISO(data);
  }

  isNow(data: string): boolean {
    const dt: Date = parseISO(data);
    return isSameDay(dt, new Date());
  }
}
