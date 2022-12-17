import {Component, OnInit, ViewChild} from '@angular/core';
import {DadosService} from '../core/services/dados.service';
import {AlertController, IonContent, ModalController, Platform, ToastController} from '@ionic/angular';
import {StatusBar} from '@ionic-native/status-bar/ngx';
import {AuthService} from '../core/services/auth.service';
import {ModalRasuraComponent} from '../shared/components/modal-rasura/modal-rasura.component';
import {ModalHoraExtraComponent} from '../shared/components/modal-hora-extra/modal-hora-extra.component';
import {ToastsService} from '../shared/services/toasts.service';
import {Dia} from '../core/models/dia';
import {endOfMonth, formatISO, getMonth, getYear, isSameDay, parseISO, set, startOfMonth, subYears} from 'date-fns';
import {animate, query, stagger, style, transition, trigger} from '@angular/animations';
import {ActivatedRoute} from '@angular/router';

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

  @ViewChild(IonContent, { static: false }) content: IonContent;

  producao: Array<Dia>;

  dtConfig: {
    max: string;
    min: string;
    monthNames: Array<string>;
    monthShortNames: Array<string>;
  } = {
    max: formatISO(endOfMonth(new Date())),
    min: formatISO(subYears(startOfMonth(new Date()), 5)),
    monthNames: [
      'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ],
    monthShortNames: [
      'jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'
    ],
  };
  loading: {
    producao: boolean;
  } = {
    producao: false,
  };

  private dataAtual: Date = set(new Date(), {hours: 0, minutes: 0, seconds: 0, milliseconds: 0});

  constructor(
    private dadosService: DadosService,
    private alertController: AlertController,
    private authService: AuthService,
    private platform: Platform,
    private statusBar: StatusBar,
    private toastsService: ToastsService,
    private modalController: ModalController,
    private route: ActivatedRoute,
    private toastController: ToastController
  ) {
  }

  get data(): string {
    return formatISO(this.dataAtual);
  }

  set data(data) {
    this.dataAtual = parseISO(data);
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
      this.toastsService.showToastSuccess('Rasura(s), inserida(s) com sucesso.');
      this.getProducao();
    }
  }

  async modalHoraExtra(dia: Dia) {
    if (dia.balance?.solicitation.length > 0) {
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
      if (data.success) {
        this.toastsService.showToastSuccess('Hora(s) extra(s), solicitada(s) com sucesso.');
        this.getProducao();
      }
    } else {
      const toast = await this.toastController.create({
        message: 'Ops, não existe hora extra para o dia selecionado.',
        duration: 3000,
        color: 'secondary',
        position: 'bottom',
      });
      await toast.present();
    }
  }

  formatDate(data: string): Date {
    return parseISO(data);
  }

  isNow(data: string): boolean {
    const dt: Date = parseISO(data);
    return isSameDay(dt, new Date());
  }

  async scrollTo() {
    const header = document.getElementById('header');
    const anchor = document.getElementById('hoje');
    const posicao = anchor.getBoundingClientRect().top - header.clientHeight - 9;
    // anchor.scrollIntoView({behavior: 'smooth', block: 'start'});
    // window.scrollTo({top: posicao, behavior: 'smooth'});
    // const posicao = anchor.getBoundingClientRect().top - header.clientHeight - 9;
    await this.content.scrollByPoint(0, posicao, 800);
  }
}
