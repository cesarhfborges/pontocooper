import {Component, OnDestroy, OnInit} from '@angular/core';
import {
  AlertController,
  AlertInput,
  IonRouterOutlet,
  LoadingController,
  Platform,
  ToastController,
  ViewWillEnter
} from '@ionic/angular';
import {BehaviorSubject, debounceTime, Observable, Subject, tap, timer} from 'rxjs';
import {AuthService} from '../core/services/auth.service';
import {Usuario} from '../core/models/usuario';
import {DadosService} from '../core/services/dados.service';
import {Summary} from '../core/interfaces/summary';
import {addMinutes, addSeconds, format, getHours, parseISO, set, subMinutes} from 'date-fns';
import {BancoDeHoras} from '../core/interfaces/banco-de-horas';
import {Batida} from '../core/models/batida';
import {Ponto} from '../core/models/ponto';
import {environment} from '../../environments/environment';
import {LocalNotifications} from '@capacitor/local-notifications';
import {Geolocation} from '@capacitor/geolocation';
import {LocalNotificationSchema} from '@capacitor/local-notifications/dist/esm/definitions';
import {App} from "@capacitor/app";
import {distinctUntilChanged} from "rxjs/operators";

interface Coords {
  latitude: number;
  longitude: number;
}

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
  loading: {
    profile: boolean;
    summary: boolean;
    bancoDeHoras: boolean;
    timeline: boolean;
  } = {
    profile: true,
    summary: true,
    bancoDeHoras: true,
    timeline: true
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
    pending: ''
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

  ngOnInit(): void {
    this.dataAtual = new Date();
    this.timer = timer(1000, 1000);
    this.timer.subscribe({
      next: () => {
        this.dataAtual = new Date();
        this.horasTrabalhadas = this.ponto.horasTrabalhadas;
        // // TODO: AJUSTAR AQUI
        // if (this.perfil) {
        //   this.calculaValor(this.perfil.hourly_rate as number);
        // }
      }
    });
    this.monitorarBtnBack();
  }

  ionViewWillEnter(): void {
    this.getPerfil();
    this.getBancoDeHoras();
    this.getSumario();
    this.getTimeLine();
  }

  ngOnDestroy(): void {
    this.timer = undefined;
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
          mode: 'ios'
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

  get jornadaDiaria(): number {
    const workingHours = this.summary.workingHours ?? 8;
    const val = Math.trunc(getHours(this.horasTrabalhadas) / workingHours * 100);
    return val > 99 ? 100 : val;
  }

  isLoading(): boolean {
    return this.loading.summary || this.loading.bancoDeHoras || this.loading.timeline;
  }

  getPerfil() {
    this.loading.profile = true;
    this.authService.perfil().subscribe({
      next: (response) => {
        console.log('valor recebido: ', response);
        this.perfil = response;
        this.loading.profile = false;
      },
      error: () => {
        this.loading.profile = false;
      },
    });
  }

  getSumario() {
    this.loading.summary = true;
    const year: string = format(this.dataAtual, 'yyyy');
    const month: string = format(this.dataAtual, 'MM');
    this.dadosService.getSummary(year, month).subscribe({
      next: (response) => {
        this.summary = {
          workingHours: response.working_hours,
          businessDays: response.business_days,
          hoursToWork: response.hours_to_work,
          remainingHours: response.remaining_hours
        };
        this.loading.summary = false;
      },
      error: () => {
        this.loading.summary = false;
      }
    });
  }

  getBancoDeHoras() {
    this.loading.bancoDeHoras = true;
    this.dadosService.getBancoDeHoras().subscribe({
      next: (response) => {
        this.bancoDeHoras = response;
        this.loading.bancoDeHoras = false;
      },
      error: () => {
        this.loading.bancoDeHoras = false;
      },
    });
  }

  getTimeLine($event?: any) {
    this.loading.timeline = true;
    this.dadosService.getTimeline().subscribe({
      next: (response) => {
        this.ponto.limparPontos();
        for (const batida of response.timeline) {
          this.ponto.addPonto({
            ...batida,
            worktime_clock: parseISO(batida.worktime_clock)
          });
        }
        this.loading.timeline = false;
      },
      error: () => {
        this.loading.timeline = false;
        $event?.target?.cancel();
      },
      complete: () => {
        $event?.target?.complete();
      }
    });
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
          label: `Essa é minha pausa de ${Ponto.intervalo(30).label}.`,
          value: true,
          checked: false
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
              }
            },
            {
              text: 'Registrar',
              cssClass: 'btn-done',
              handler: (teste: Array<boolean>) => {
                const r: boolean = teste?.length > 0 ? teste[0] : false;
                alert.dismiss(r, 'done');
                return false;
              }
            }
          ],
          inputs: isWorking ? [input] : []
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
          console.log('ponto response: ', response);
          await loading.dismiss();
          if (response !== undefined) {
            this.ponto.baterPonto(data);
            await this.limparNotificacoes();
            // if (data === true) {
            //   await this.agendarNotificacao(dataHoraAgendamento);
            // }
            // this.ponto.setIntervalo(data, this.opcoes.intervalo);
            if (data === true) {
              // const dataHora: Date = addMinutes(new Date(), this.opcoes.intervalo);
              const dataHoraAgendamento: Date = addMinutes(new Date(), 30);
              await this.agendarNotificacao(dataHoraAgendamento);
              const toast: any = await this.toastController.create({
                message: `Você será notificado em ${Ponto.intervalo(30).label} para não esquecer o ponto. ;)`,
                duration: 3000,
                color: 'success',
              });
              toast.present();
            }
            // if (this.ponto.isInterval()) {
            //   // nada
            // }
          }
        }
      } catch (e) {
      }
    } else {
      const loading = await this.loadingController.create({
        message: 'É Necessário aguardar o mínimo de 30 minutos para registrar o ponto.',
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

  async agendarNotificacao(atDateTime: Date) {
    const permissionStatus = await LocalNotifications.checkPermissions();
    if (permissionStatus.display === 'granted') {
      const schemas: LocalNotificationSchema[] = [
        {
          id: 1,
          title: 'CooperSystem- 1 - Title',
          body: 'teste de notificação - 1 - body',
          largeBody: 'teste de notificação - 1 - largeBody',
          summaryText: 'teste de notificação - 1 - summaryText',
          channelId: 'ponto',
          schedule: {
            at: subMinutes(atDateTime, 5),
            allowWhileIdle: true
          }
        },
        {
          id: 2,
          title: 'CooperSystem- 2 - Title',
          body: 'teste de notificação - 2 - body',
          largeBody: 'teste de notificação - 2 - largeBody',
          summaryText: 'teste de notificação - 2 - summaryText',
          channelId: 'ponto',
          schedule: {
            at: atDateTime,
            allowWhileIdle: true
          }
        },
      ];
      const schedule = await LocalNotifications.schedule({notifications: schemas});
      console.log('scheduled: ', schedule, format(addSeconds(new Date(), 20), 'dd/MM/yyyy HH:mm:ss'));
    } else {
      const request = await LocalNotifications.requestPermissions();
      console.log('request permissions: ', request);
    }
  }
}
