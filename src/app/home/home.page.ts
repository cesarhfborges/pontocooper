import {AfterViewInit, Component, OnInit} from '@angular/core';
import {DadosService} from '../core/services/dados.service';
import {
  AlertController,
  AlertInput,
  IonRouterOutlet,
  MenuController,
  Platform,
  ToastController,
  ViewDidEnter
} from '@ionic/angular';
import {AuthService} from '../core/services/auth.service';
import {StatusBar} from '@ionic-native/status-bar/ngx';
import {Ponto} from '../core/models/ponto';
import {Geolocation} from '@ionic-native/geolocation/ngx';
import {ILocalNotification, LocalNotifications} from '@ionic-native/local-notifications/ngx';
import {animate, query, stagger, style, transition, trigger} from '@angular/animations';
import {addMinutes, format, getHours, parseISO, set, subMinutes} from 'date-fns';
import {Observable, timer} from 'rxjs';
import {App} from '@capacitor/app';
import {distinctUntilChanged} from 'rxjs/operators';
import {DownloadService} from '../core/services/download.service';
import npm from '../../../package.json';
import {Router} from '@angular/router';
import {Batida} from '../core/models/batida';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  animations: [
    trigger('slideOutAnimation', [
      transition('* => *', [
        query(':leave',
          style({opacity: 1}),
          {optional: true}
        ),
        query(':leave', [
            style({opacity: 1}),
            animate('600ms ease-in-out', style({opacity: 0}))],
          {optional: true}
        ),
        query(':enter',
          style({opacity: 0, transform: 'translateX(-30px)'}),
          {optional: true}
        ),
        query(':enter', stagger(150, [
          style({opacity: 0, transform: 'translateX(-30px)'}),
          animate('250ms ease-in-out', style({opacity: 1, transform: 'translateX(0)'}))
        ]), {optional: true}),
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

  // coords = {
  //   lat: -15.7962774,
  //   lon: -47.9481004
  // };

  perfil: any;

  opcoes: {
    darkMode: 'automatico' | 'dark' | 'light';
    loginRemember: boolean;
    valorAcumulado: boolean;
    intervalo: number;
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
    summary: true,
    timeline: true,
    bancoDeHoras: true,
    opcoes: true,
    perfil: true,
    update: true,
  };

  timer: Observable<number>;

  constructor(
    private dadosService: DadosService,
    private alertController: AlertController,
    private authService: AuthService,
    private platform: Platform,
    private statusBar: StatusBar,
    private geolocation: Geolocation,
    private menu: MenuController,
    private toastController: ToastController,
    private routerOutlet: IonRouterOutlet,
    private localNotifications: LocalNotifications,
    private downloadService: DownloadService,
    private router: Router,
  ) {
    this.timer = timer(1000, 1000);
    this.dataAtual = new Date();
    const batidas: Array<Batida> = [];
    this.ponto = new Ponto(batidas);
    this.timer.subscribe(() => {
      this.dataAtual = new Date();
      this.horasTrabalhadas = this.ponto.horasTrabalhadas;
      // TODO: AJUSTAR AQUI
      if (this.perfil) {
        this.calculaValor(this.perfil.hourly_rate as number);
      }
    });
  }

  get jornadaDiaria(): number {
    const val = Math.trunc(getHours(this.horasTrabalhadas) / (this.summary.workingHours ?? 8) * 100);
    return val > 99 ? 100 : val;
  }

  ngOnInit(): void {
    this.platform.ready().then(() => {
      if (this.platform.is('cordova')) {
        this.notificacoes().catch();
      }
    });
    this.loading.perfil = true;
    this.authService.perfil().subscribe(response => {
        this.perfil = response;
        this.loading.perfil = false;
      },
      error => {
        this.loading.perfil = false;
      });
    this.platform.backButton.subscribeWithPriority(-1, () => {
      if (!this.routerOutlet.canGoBack()) {
        App.exitApp();
      }
    });
  }

  async notificacoes() {
    try {
      const response = await this.localNotifications.on('click').pipe(distinctUntilChanged()).toPromise();
      console.log(response);
    } catch (e) {
      console.log(e);
    }
  }

  ngAfterViewInit(): void {
    this.platform.ready().then(() => {
      this.statusBar.overlaysWebView(false);
      this.statusBar.backgroundColorByHexString('#178865');
      // this.getCoords().then(r => {
      //   this.coords = r;
      // });
    }).catch(e => {
    });
    this.checkUpdate().catch();
  }

  calculaValor(valorHora: number): void {
    const valorMinuto = valorHora / 60;
    const valorSegundo = valorMinuto / 60;
    this.valorAcumulado = (this.horasTrabalhadas.getHours() * valorHora) +
      (this.horasTrabalhadas.getMinutes() * valorMinuto) +
      (this.horasTrabalhadas.getSeconds() * valorSegundo);
  }

  isLoading(): boolean {
    return this.loading.summary || this.loading.bancoDeHoras || this.loading.timeline || this.loading.perfil;
  }

  async getDados($event?): Promise<void> {
    try {
      await this.getSumario();
      await this.getBancoDeHoras();
      await this.getTimeLine();
      $event.target.complete();
    } catch (e) {
      $event.target.cancel();
    }
  }

  async getCoords(): Promise<{ latitude: number; longitude: number }> {
    const {coords} = await this.geolocation.getCurrentPosition();
    return coords;
  }

  async getBancoDeHoras(): Promise<void> {
    try {
      this.loading.bancoDeHoras = true;
      this.bancoDeHoras = await this.dadosService.getBancoDeHoras().toPromise();
      this.loading.bancoDeHoras = false;
      return Promise.resolve();
    } catch (e) {
      console.log(e);
      this.bancoDeHoras = {
        balance: '0',
        pending: '0'
      };
      const toast = await this.toastController.create({
        message: 'Erro ao obter o banco de horas, verifique a rede.',
        duration: 2000,
        color: 'danger'
      });
      await toast.present();
      return Promise.reject('error');
    }
  }

  async getTimeLine(): Promise<void> {
    try {
      this.loading.timeline = true;
      const timeline = await this.dadosService.getTimeline().toPromise();
      this.ponto.limparPontos();
      for (const batida of timeline.timeline) {
        this.ponto.addPonto({
          ...batida,
          worktime_clock: parseISO(batida.worktime_clock)
        });
      }
      this.loading.timeline = false;
      return Promise.resolve();
    } catch (e) {
      const toast = await this.toastController.create({
        message: 'Erro ao obter linha do tempo, verifique a rede.',
        duration: 2000,
        color: 'danger'
      });
      await toast.present();
      return Promise.reject('error');
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
      return Promise.resolve();
    } catch (e) {
      this.summary = {
        workingHours: 0,
        businessDays: 0,
        hoursToWork: 0,
        remainingHours: 0
      };
      const toast = await this.toastController.create({
        message: 'Erro ao obter sum??rio, verifique a rede.',
        duration: 2000,
        color: 'danger'
      });
      await toast.present();
      return Promise.reject('error');
    }
  }

  async registrarPonto() {
    try {
      const input: AlertInput = {
        name: 'pausa',
        type: 'checkbox',
        label: `Essa ?? minha pausa de ${Ponto.intervalo(this.opcoes.intervalo).label}.`,
        value: true,
        checked: false
      };
      const alert = await this.alertController.create({
        cssClass: 'alerta',
        header: `Deseja confirmar ${this.ponto.trabalhando ? 'Sa??da' : 'Entrada'}?`,
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
      setTimeout(() => {
        this.alertController.dismiss();
      }, 120000);
      const {data} = await alert.onDidDismiss();
      if (data !== undefined) {
        await this.cancelarNotificacoes();
        const {latitude, longitude} = await this.getCoords();
        const response: any = await this.dadosService.baterPonto({
          check_in: !this.ponto.trabalhando,
          latitude: latitude ?? -15.7962774,
          longitude: longitude ?? -47.9481004
        }).toPromise();
        if (response !== undefined) {
          this.ponto.baterPonto(data);
          this.ponto.setIntervalo(data, this.opcoes.intervalo);
          if (data === true) {
            const dataHora: Date = addMinutes(new Date(), this.opcoes.intervalo);
            await this.agendarNotificacao(dataHora);
            const toast: any = await this.toastController.create({
              message: `Voc?? ser?? notificado em ${Ponto.intervalo(this.opcoes.intervalo).label} para n??o esquecer o ponto. ;)`,
              duration: 3000,
              color: 'success',
            });
            toast.present();
          }
          if (this.ponto.isInterval()) {
            // nada
          }
        }
      }
      return Promise.resolve();
    } catch (e) {
      console.log(e);
      this.toastController.create({
        message: 'Ops... N??o foi poss??vel registrar o ponto, verifique a rede e tente novamente.',
        duration: 2000,
        color: 'danger'
      }).then(toast => {
        toast.present();
      });
      return Promise.reject('error');
    }
  }

  async ionViewDidEnter(): Promise<void> {
    await this.loadOptions();
    await this.getSumario();
    await this.getBancoDeHoras();
    await this.getTimeLine();
    await this.menuControl(true);
    return Promise.resolve();
  }

  async loadOptions(): Promise<void> {
    this.loading.opcoes = true;
    const lc: any = localStorage.getItem('opcoes');
    if (lc) {
      this.opcoes = JSON.parse(lc);
    }
    this.loading.opcoes = false;
    return Promise.resolve();
  }

  async menuControl(status: boolean) {
    if (await this.menu.isOpen()) {
      await this.menu.close();
    }
    await this.menu.enable(status, 'principal');
  }

  async cancelarNotificacoes(): Promise<void> {
    if (this.platform.is('cordova')) {
      await this.localNotifications.cancelAll();
    }
    return Promise.resolve();
  }

  async agendarNotificacao(data: Date): Promise<void> {
    if (this.platform.is('cordova')) {
      const notificacao: ILocalNotification = {
        id: 1,
        priority: 2,
        vibrate: true,
        wakeup: true,
        lockscreen: true,
        launch: true,
        sticky: true,
        clock: false,
        silent: false,
        autoClear: true,
        badge: 0,
        led: 'FF0000',
        group: 'ponto',
        text: 'Seu intervalo se encerra no pr??ximo minuto.',
        title: 'Ponto',
        trigger: {after: subMinutes(data, 1)},
      };
      await this.localNotifications.schedule(notificacao);
    }
    return Promise.resolve();
  }

  async checkUpdate() {
    try {
      this.loading.update = true;
      const versaoApp: Array<number> = npm.version.split('.').map(n => Number(n));
      const data: any = await this.downloadService.getAppVersion().toPromise();
      const versaoAtual: Array<number> = data.version.split('.').map(n => Number(n));
      for (let i = 0; i < versaoAtual.length; i++) {
        if (versaoAtual[i] > versaoApp[i]) {

          const descriptions: Array<string> = npm.buildInfo;
          const alert = await this.alertController.create({
            cssClass: 'buttonsCss',
            header: 'Atualiza????o',
            backdropDismiss: false,
            message: `
                <p>Nova vers??o disponivel <strong>${data.version}</strong></p>
                <ul>${descriptions.map(u => '<li>' + u + '.</li>').join('')}</ul>
            `,
            buttons: [
              {
                text: 'Depois',
                role: 'cancel',
                cssClass: 'dismissButton'
              }, {
                text: 'Atualizar',
                cssClass: 'updateButton',
                handler: () => {
                  this.router.navigate(['/opcoes']);
                }
              }
            ]
          });
          await alert.present();
          break;
        }
      }
      // this.versaoApp = data.version;
      this.loading.update = false;
    } catch (e) {
      this.loading.update = false;
    }
  }
}
