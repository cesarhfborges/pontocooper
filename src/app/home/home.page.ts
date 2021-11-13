import {AfterViewInit, Component, OnInit} from '@angular/core';
import {DadosService} from '../core/services/dados.service';
import {AlertController, AlertInput, MenuController, Platform, ToastController, ViewDidEnter} from '@ionic/angular';
import {AuthService} from '../core/services/auth.service';
import {StatusBar} from '@ionic-native/status-bar/ngx';
import {Ponto} from '../core/models/ponto';
import {Geolocation} from '@ionic-native/geolocation/ngx';
import {animate, query, stagger, style, transition, trigger} from '@angular/animations';
import {format, getHours, parseISO, set} from 'date-fns';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  animations: [
    trigger('slideOutAnimation', [
      transition('* => *', [
        query(':enter',
          style({opacity: 0, transform: 'translateX(-30px)'}),
          {optional: true}
        ),
        query(':enter', stagger(150, [
          style({opacity: 0, transform: 'translateX(-30px)'}),
          animate('250ms ease-in-out', style({opacity: 1, transform: 'translateX(0)'}))
        ]), {optional: true}),
        query(':leave',
          style({opacity: 1}),
          {optional: true}
        ),
        query(':leave', [
            style({opacity: 1}),
            animate('600ms ease-in-out', style({opacity: 0}))],
          {optional: true}
        )
      ])
    ]),
  ]
})
export class HomePage implements OnInit, AfterViewInit, ViewDidEnter {

  ponto: Ponto;

  dataAtual: Date;

  horasTrabalhadas: Date = set(new Date(), {hours: 0, minutes: 0, seconds: 0});
  valorAcumulado = 0;
  valorHora = 0;

  coords = {
    lat: -15.7962774,
    lon: -47.9481004
  };

  opcoes: {
    darkMode: 'automatico' | 'dark' | 'light';
    loginRemember: boolean;
    valorAcumulado: boolean;
  };

  bancoDeHoras: {
    balance: string;
    pending: string;
  } = {
    balance: null,
    pending: null
  };

  summary: {
    workingHours: number;
    businessDays: number;
    hoursToWork: number;
    remainingHours: number;
  } = {
    workingHours: 0,
    businessDays: 0,
    hoursToWork: 0,
    remainingHours: 0,
  };

  loading = {
    summary: false,
    timeline: false,
    bancoDeHoras: false
  };

  constructor(
    private dadosService: DadosService,
    private alertController: AlertController,
    private authService: AuthService,
    private platform: Platform,
    private statusBar: StatusBar,
    private geolocation: Geolocation,
    private menu: MenuController,
    private toastController: ToastController
  ) {
    //#1da57a
    this.dataAtual = new Date();
    const batidas: Array<Date> = [];
    this.ponto = new Ponto(batidas);
    setInterval(() => {
      this.horasTrabalhadas = this.ponto.horasTrabalhadas;
      this.calculaValor(82);
    }, 1000);
    this.authService.getAuth().subscribe(
      usuario => {
        console.log(usuario);
      }
    );
  }

  get jornadaDiaria(): number {
    const val = Math.trunc(getHours(this.horasTrabalhadas) / 8 * 100);
    return val > 99 ? 100 : val;
  }

  async ngOnInit(): Promise<void> {
    // this.getDados();
    await this.getSumario();
    await this.getBancoDeHoras();
    await this.getTimeLine();
  }

  ngAfterViewInit(): void {
    this.platform.ready().then(() => {
      this.statusBar.overlaysWebView(false);
      this.statusBar.backgroundColorByHexString('#178865');
      this.geolocation.getCurrentPosition().then((resp) => {
        this.coords.lat = resp.coords.latitude;
        this.coords.lon = resp.coords.longitude;
      }).catch(e => {
      });
    }).catch(e => {
    });
  }

  calculaValor(valorHora: number): void {
    const valorMinuto = valorHora / 60;
    const valorSegundo = valorMinuto / 60;
    this.valorAcumulado = (this.horasTrabalhadas.getHours() * valorHora) +
      (this.horasTrabalhadas.getMinutes() * valorMinuto) +
      (this.horasTrabalhadas.getSeconds() * valorSegundo);
  }

  async getDados($event?): Promise<void> {
    await this.getSumario();
    await this.getBancoDeHoras();
    await this.getTimeLine();
    $event.target.complete();
  }

  async getBancoDeHoras(): Promise<void> {
    try {
      this.loading.bancoDeHoras = true;
      this.bancoDeHoras = await this.dadosService.getBancoDeHoras().toPromise();
      this.loading.bancoDeHoras = false;
    } catch (e) {
      console.log(e);
      const toast = await this.toastController.create({
        message: 'Erro ao obter o banco de horas, verifique a rede.',
        duration: 2000,
        color: 'danger'
      });
      await toast.present();
    }
  }

  async getTimeLine(): Promise<void> {
    try {
      this.loading.timeline = true;
      const timeline = await this.dadosService.getTimeline().toPromise();
      this.ponto.limparPontos();
      for (const batida of timeline.timeline) {
        this.ponto.addPonto(parseISO(batida.worktime_clock));
      }
      this.loading.timeline = false;
    } catch (e) {
      const toast = await this.toastController.create({
        message: 'Erro ao obter linha do tempo, verifique a rede.',
        duration: 2000,
        color: 'danger'
      });
      await toast.present();
    }
  }

  async getSumario(): Promise<void> {
    try {
      this.loading.summary = true;
      const dateNow: Date = new Date(Date.now());
      const sumario = await this.dadosService.getSummary(format(dateNow, 'yyyy'), format(dateNow, 'MM')).toPromise();
      this.summary = {
        workingHours: sumario.working_hours,
        businessDays: sumario.business_days,
        hoursToWork: sumario.hours_to_work,
        remainingHours: sumario.remaining_hours
      };
      this.loading.summary = false;
    } catch (e) {
      const toast = await this.toastController.create({
        message: 'Erro ao obter sumário, verifique a rede.',
        duration: 2000,
        color: 'danger'
      });
      await toast.present();
    }
  }

  async registrarPonto() {
    const input: AlertInput = {
      name: 'pausa',
      type: 'checkbox',
      label: 'Essa é minha pausa de no mínimo 30 minutos.',
      value: true,
      checked: false
    };
    const alert = await this.alertController.create({
      cssClass: 'alerta',
      header: `Deseja confirmar ${this.ponto.trabalhando ? 'Saída' : 'Entrada'}?`,
      buttons: [
        {
          text: 'Cancelar',
          handler: () => {
            alert.dismiss();
            return false;
          }
        },
        {
          text: 'Registrar',
          handler: (teste: Array<boolean>) => {
            const r: boolean = teste?.length > 0 ? teste[0] : false;
            alert.dismiss(r);
            return false;
          }
        }
      ],
      inputs: this.ponto.trabalhando ? [input] : []
    });
    await alert.present();
    const {data} = await alert.onDidDismiss();
    if (data !== undefined) {
      this.dadosService.baterPonto({
        check_in: !this.ponto.trabalhando,
        latitude: this.coords.lat,
        longitude: this.coords.lon
      }).subscribe(
        response => {
          this.ponto.baterPonto();
          if (this.ponto.isInterval()) {
            // nada
          }
        },
        error => {
          console.log(error);
        }
      );
    }
  }

  ionViewDidEnter(): void {
    const lc: any = localStorage.getItem('opcoes');
    if (lc) {
      this.opcoes = JSON.parse(lc);
    }
    this.menuControl(true).catch(e => console.log(e));
  }

  async menuControl(status: boolean) {
    if (await this.menu.isOpen()) {
      await this.menu.close();
    }
    await this.menu.enable(status, 'principal');
  }
}
