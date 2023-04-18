import {Component, OnInit, ViewChild} from '@angular/core';
import {animate, query, stagger, style, transition, trigger} from '@angular/animations';
import {formatISO, getMonth, getYear, isSameDay, parseISO, set, startOfMonth} from 'date-fns';
import {ModalDatePickerComponent} from '../shared/components/modal-date-picker/modal-date-picker.component';
import {IonContent, ModalController} from '@ionic/angular';
import {Dia} from '../core/models/dia';
import {DadosService} from '../core/services/dados.service';

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

  @ViewChild(IonContent, { static: false }) content: IonContent | undefined;

  dataAtual: Date = set(startOfMonth(new Date()), {hours: 0, minutes: 0, seconds: 0, milliseconds: 0});

  producao: Array<Dia> = [];

  loading: {
    producao: boolean;
  } = {
    producao: false,
  };

  constructor(
    private modalCtrl: ModalController,
    private dadosService: DadosService,
  ) {
  }

  ngOnInit() {
    this.dataAtual = set(startOfMonth(new Date()), {hours: 0, minutes: 0, seconds: 0, milliseconds: 0});
    this.getProducao();
  }

  async openModal() {
    const modal = await this.modalCtrl.create({
      component: ModalDatePickerComponent,
      cssClass: 'datePicker',
      componentProps: {dataSelecionada: formatISO(this.dataAtual)},
    });
    await modal.present();

    const {data, role} = await modal.onWillDismiss();

    if (role === 'confirm') {
      this.dataAtual = parseISO(data);
    }
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
    // const modal = await this.modalController.create({
    //   component: ModalRasuraComponent,
    //   cssClass: 'my-custom-class',
    //   swipeToClose: true,
    //   backdropDismiss: false,
    //   keyboardClose: false,
    //   animated: true,
    //   componentProps: {
    //     dados: dia
    //   }
    // });
    // await modal.present();
    // const {data} = await modal.onWillDismiss();
    // if (data.success) {
    //   this.toastsService.showToastSuccess('Rasura(s), inserida(s) com sucesso.');
    //   this.getProducao();
    // }
  }

  async modalHoraExtra(dia: Dia) {
    // if (dia.balance?.solicitation.length > 0) {
    //   const modal = await this.modalController.create({
    //     component: ModalHoraExtraComponent,
    //     cssClass: 'my-custom-class',
    //     swipeToClose: true,
    //     backdropDismiss: false,
    //     keyboardClose: false,
    //     animated: true,
    //     componentProps: {
    //       dados: dia
    //     }
    //   });
    //   await modal.present();
    //   const {data} = await modal.onWillDismiss();
    //   if (data.success) {
    //     this.toastsService.showToastSuccess('Hora(s) extra(s), solicitada(s) com sucesso.');
    //     this.getProducao();
    //   }
    // } else {
    //   const toast = await this.toastController.create({
    //     message: 'Ops, não existe hora extra para o dia selecionado.',
    //     duration: 3000,
    //     color: 'secondary',
    //     position: 'bottom',
    //   });
    //   await toast.present();
    // }
  }

  isNow(data: string): boolean {
    const dt: Date = parseISO(data);
    return isSameDay(dt, new Date());
  }

  formatDate(data: string): Date {
    return parseISO(data);
  }

  async scrollTo() {
    const header = document.getElementById('header');
    console.log('header: ', header);
    const anchor = document.getElementById('hoje');
    console.log('anchor: ', anchor);
    if (anchor && header) {
      const posicao = anchor.getBoundingClientRect().top - header.clientHeight - 10;
      // anchor.scrollIntoView({behavior: 'smooth', block: 'start'});
      // window.scrollTo({top: posicao, behavior: 'smooth'});
      // const posicao = anchor.getBoundingClientRect().top - header.clientHeight - 9;
      await this.content?.scrollByPoint(0, posicao, 800);
    }
  }
}
