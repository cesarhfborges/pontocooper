import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  AlertController,
  AlertInput,
  IonRouterOutlet,
  LoadingController,
  Platform,
  ToastController,
  ViewWillEnter,
} from '@ionic/angular';
import { lastValueFrom, Observable, timer } from 'rxjs';
import { AuthService } from '../core/services/auth.service';
import { Usuario } from '../core/models/usuario';
import { DadosService } from '../core/services/dados.service';
import { Summary } from '../core/interfaces/summary';
import { addMinutes, addSeconds, format, getHours, parseISO, set, subMinutes } from 'date-fns';
import { BancoDeHoras } from '../core/interfaces/banco-de-horas';
import { Batida } from '../core/models/batida';
import { Ponto } from '../core/models/ponto';
import { environment } from '../../environments/environment';
import { LocalNotifications } from '@capacitor/local-notifications';
import { Geolocation } from '@capacitor/geolocation';
import { LocalNotificationSchema } from '@capacitor/local-notifications/dist/esm/definitions';
import { App } from '@capacitor/app';
import { Coords, LoadingStatus } from '../shared/models';
import { PredefinedColors } from '@ionic/core';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit, ViewWillEnter, OnDestroy {

  production: boolean = environment.production;
  horasTrabalhadas: Date = set(new Date(), {hours: 0, minutes: 0, seconds: 0});
  dataAtual: Date = new Date();
  timer: Observable<number> | undefined;
  loading: LoadingStatus = {
    profile: {loading: true, error: false},
    summary: {loading: true, error: false},
    bancoDeHoras: {loading: true, error: false},
    timeline: {loading: true, error: false},
  };
  perfil: Usuario | undefined;
  summary: Summary = {
    workingHours: 0,
    businessDays: 0,
    hoursToWork: 0,
    remainingHours: 0,
  };
  bancoDeHoras: BancoDeHoras = {
    balance: '',
    pending: '',
  };
  ponto: Ponto;
  buttonEvent: Date = new Date();

  constructor(
    private authService: AuthService,
    private dadosService: DadosService,
    private alertController: AlertController,
    private loadingController: LoadingController,
    private toastController: ToastController,
    private platform: Platform,
    private routerOutlet: IonRouterOutlet,
  ) {
    const batidas: Array<Batida> = [];
    this.ponto = new Ponto(batidas);
  }

  get jornadaDiaria(): number {
    const workingHours = this.summary.workingHours ?? 8;
    const val = Math.trunc((getHours(this.horasTrabalhadas) / workingHours) * 100);
    return val > 99 ? 100 : val;
  }

  get progressColor(): PredefinedColors {
    if (this.ponto?.batidas?.length > 0) {
      if (this.ponto.estaNoIntervalo()) {
        return 'tertiary';
      }
      return this.jornadaDiaria > 99 ? 'success' : 'warning'
    }
    return 'medium';
  }

  get progressValue(): number {
    if (this.jornadaDiaria > 99) {
      return 1;
    }
    return this.jornadaDiaria / 100
  }

  ngOnInit(): void {
    this.dataAtual = new Date();
    this.timer = timer(0, 1000);
    this.timer.subscribe({
      next: () => {
        this.dataAtual = new Date();
        this.horasTrabalhadas = this.ponto.horasTrabalhadas;
        // // TODO: AJUSTAR AQUI
        // if (this.perfil) {
        //   this.calculaValor(this.perfil.hourly_rate as number);
        // }
      },
    });
    this.monitorarBtnBack();
  }

  ionViewWillEnter(): void {
    this.loadData();
  }

  ngOnDestroy(): void {
    this.timer = undefined;
  }

  loadData($event: any = undefined): void {
    Promise.all([
      this.getPerfil(),
      this.getBancoDeHoras(),
      this.getSumario(),
      this.getTimeLine(),
    ]).then(() => {
      $event?.target?.complete();
    }).catch((error) => {
      $event?.target?.cancel();
      this.toastController.create({
        message: error,
        duration: 3000,
        color: 'danger',
      }).then(toast => {
        toast.present().catch();
      });
    });
  }

  monitorarBtnBack(): void {
    this.platform.backButton.subscribeWithPriority(-1, async () => {
      if (!this.routerOutlet.canGoBack()) {
        const toast = await this.toastController.create({
          message: `Pressione novamente sair do app.`,
          duration: 3000,
          color: 'medium',
          icon: 'alert-circle-outline',
          animated: true,
          mode: 'ios',
        });
        if (new Date() <= this.buttonEvent) {
          toast.dismiss().catch();
          App.minimizeApp().catch();
        } else {
          toast.present().catch();
          this.buttonEvent = addSeconds(new Date(), 3);
        }
      }
    });
  }

  isLoading(): boolean {
    return this.loading.summary.loading || this.loading.bancoDeHoras.loading || this.loading.timeline.loading;
  }

  async getPerfil() {
    try {
      this.loading.profile.loading = true;
      this.perfil = await lastValueFrom(this.authService.perfil());
      this.loading.profile.loading = false;
      return Promise.resolve();
    } catch (e) {
      return Promise.reject('Não foi possível obter os dados de perfil.');
    }
  }

  async getSumario() {
    try {
      this.loading.summary.loading = true;
      const year: string = format(this.dataAtual, 'yyyy');
      const month: string = format(this.dataAtual, 'MM');
      const response: any = await lastValueFrom(this.dadosService.getSummary(year, month));
      this.summary = {
        workingHours: response.working_hours,
        businessDays: response.business_days,
        hoursToWork: response.hours_to_work,
        remainingHours: response.remaining_hours,
      };
      this.loading.summary.loading = false;
      return Promise.resolve();
    } catch (e) {
      return Promise.reject('Não foi possível obter a carga horária.');
    }
  }

  async getBancoDeHoras() {
    try {
      this.loading.bancoDeHoras.loading = true;
      this.bancoDeHoras = await lastValueFrom(this.dadosService.getBancoDeHoras());
      this.loading.bancoDeHoras.loading = false;
      return Promise.resolve();
    } catch (e) {
      return Promise.reject('Não foi possível obter os dados do banco de horas.');
    }
  }

  async getTimeLine() {
    try {
      this.loading.timeline.loading = true;
      const response: any = await lastValueFrom(this.dadosService.getTimeline());
      this.ponto.limparPontos();
      for (const batida of response.timeline) {
        this.ponto.addPonto({
          ...batida,
          worktime_clock: parseISO(batida.worktime_clock),
        });
      }
      this.loading.timeline.loading = false;
      return Promise.resolve();
    } catch (e) {
      return Promise.reject('Não foi possível obter a lista de ponto.');
    }
  }

  async getCoords(): Promise<Coords> {
    try {
      const {coords}: any = await Geolocation.getCurrentPosition();
      return {latitude: coords.latitude, longitude: coords.longitude};
    } catch (e) {
      return {latitude: -15.7962774, longitude: -47.9481004};
    }
  }

  async registrarPonto() {
    if (!this.ponto.isMinInterval()) {
      try {
        const input: AlertInput = {
          name: 'pausa',
          type: 'checkbox',
          label: `Exibir notificação em ${Ponto.intervalo(30).description}.`,
          value: true,
          checked: false,
        };
        const isWorking: boolean = this.ponto.trabalhando;
        const alert = await this.alertController.create({
          cssClass: 'alerta',
          header: `Deseja confirmar ${isWorking ? 'Saída' : 'Entrada'}?`,
          buttons: [
            {
              text: 'Cancelar',
              cssClass: 'btn-cancel',
              handler: () => {
                alert.dismiss(undefined, 'cancelar');
                return false;
              },
            },
            {
              text: 'Registrar',
              cssClass: 'btn-done',
              handler: (teste: Array<boolean>) => {
                const r: boolean = teste?.length > 0 ? teste[0] : false;
                alert.dismiss(r, 'done');
                return false;
              },
            },
          ],
          inputs: isWorking ? [input] : [],
        });

        await alert.present();
        const {data, role} = await alert.onDidDismiss();
        if (role === 'done') {
          const loading = await this.loadingController.create({
            cssClass: 'my-custom-class',
            message: 'Registrando',
            backdropDismiss: false,
            keyboardClose: false,
            showBackdrop: true,
            animated: true,
            spinner: 'bubbles',
          });
          await loading.present();

          const {latitude, longitude} = await this.getCoords();

          const response: any = await this.dadosService.baterPonto({
            check_in: !this.ponto.trabalhando,
            latitude,
            longitude,
          }).toPromise();
          await loading.dismiss();
          if (response !== undefined) {
            this.ponto.baterPonto(data);
            await this.limparNotificacoes();
            if (data === true) {
              const dataHoraAgendamento: Date = addMinutes(new Date(), 30);
              await this.agendarNotificacao(dataHoraAgendamento);
              const toast: any = await this.toastController.create({
                message: `Você será notificado em ${Ponto.intervalo(30).label} para não esquecer o ponto. ;)`,
                duration: 3000,
                color: 'success',
              });
              toast.present();
            }
          }
        }
      } catch (e) {
      }
    } else {
      const loading = await this.loadingController.create({
        message: 'É Necessário ter um mínimo de 30 minutos de diferença entre a batida anterior para registrar o ponto.',
        animated: true,
        spinner: 'lines',
        backdropDismiss: false,
        duration: 3000,
      });
      await loading.present();
    }
  }

  async limparNotificacoes() {
    const permissionStatus = await LocalNotifications.checkPermissions();
    if (permissionStatus.display === 'granted') {
      await LocalNotifications.removeAllDeliveredNotifications();
    }
  }

  async agendarNotificacao(atDateTime: Date, isInterval: boolean = true) {
    const permissionStatus = await LocalNotifications.checkPermissions();
    if (permissionStatus.display === 'granted') {
      const schemas: LocalNotificationSchema[] = [
        {
          id: 1,
          title: 'CooperSystem - portal',
          body: isInterval
            ? 'Faltam cinco minutos para terminar seu intervalo.'
            : 'Faltam cinco minutos para terminar seu expediente.',
          channelId: 'ponto',
          schedule: {
            at: subMinutes(atDateTime, 5),
            allowWhileIdle: true,
          },
        },
        {
          id: 2,
          title: 'CooperSystem - portal',
          body: isInterval
            ? 'Seu intervalo terminou, não esqueça de registrar seu ponto.'
            : 'Seu expediente terminou, não esqueça de registrar seu ponto.',
          channelId: 'ponto',
          schedule: {
            at: atDateTime,
            allowWhileIdle: true,
          },
        },
      ];
      const schedule = await LocalNotifications.schedule({notifications: schemas});
    } else {
      await LocalNotifications.requestPermissions();
    }
  }
}
