import { Component, OnInit } from '@angular/core';
import { LoadingController, NavController, Platform, ToastController, ViewWillEnter } from '@ionic/angular';
import { NativeBiometric } from 'capacitor-native-biometric';
import { Credentials } from 'capacitor-native-biometric/dist/esm/definitions';
import { AuthService, Credenciais } from '../core/services/auth.service';
import { lastValueFrom, take, timer } from 'rxjs';
import { Coords } from '../shared/models';
import { Geolocation } from '@capacitor/geolocation';
import { DadosService } from '../core/services/dados.service';
import { Ponto } from '../core/models/ponto';
import { Batida } from '../core/models/batida';
import { parseISO } from 'date-fns';

type STATUS = 'waiting' | 'loading' | 'error' | 'success';

interface Etapa {
  name: string;
  status: STATUS;
  // biometry: Etapa;
  // credentials: Etapa;
  // authentication: Etapa;
  // timeline: Etapa;
  // ponto: Etapa;
}

@Component({
  selector: 'app-ponto-automatico',
  templateUrl: './ponto-automatico.page.html',
  styleUrls: ['./ponto-automatico.page.scss'],
})
export class PontoAutomaticoPage implements OnInit, ViewWillEnter {

  etapas: Etapa[] = [
    {name: 'biometry', status: 'waiting'},
    {name: 'credentials', status: 'waiting'},
    {name: 'authentication', status: 'waiting'},
    {name: 'timeline', status: 'waiting'},
    {name: 'ponto', status: 'waiting'},
  ];
  //   {
  //   biometry: 'waiting',
  //   credentials: 'waiting',
  //   authentication: 'waiting',
  //   timeline: 'waiting',
  //   ponto: 'waiting',
  // };
  private ponto: Ponto;
  private biometricServer: string = 'portal.coopersystem.com.br';

  constructor(
    private authService: AuthService,
    private platform: Platform,
    private dadosService: DadosService,
    private toastController: ToastController,
    private loadingController: LoadingController,
    private navCtrl: NavController,
  ) {
    const batidas: Array<Batida> = [];
    this.ponto = new Ponto(batidas);
  }

  ngOnInit() {
  }

  ionViewWillEnter(): void {
    this.initialize().catch();
  }

  getEtapa(name: string): STATUS | null {
    const item: Etapa | undefined = this.etapas.find(i => i.name === name);
    if (item !== undefined) {
      return item.status;
    }
    return 'error';
  }

  async checkBiometryAvaliable() {
    try {
      this.setEtapa('biometry', 'loading');
      const {isAvailable} = await NativeBiometric.isAvailable();
      // const isAvailable = true;
      if (isAvailable) {
        this.setEtapa('biometry', 'success');
        return Promise.resolve(true);
      }
      this.setEtapa('biometry', 'error');
      return Promise.reject('Este dispositivo não possui biometria disponível.');
    } catch (e) {
      this.setEtapa('biometry', 'error');
      // this.etapas.biometry = 'error';
      return Promise.reject('Não foi possível verificar o hardware da biometria.');
    }
  }

  async getBiometryCredentials(): Promise<Credentials | null> {
    try {
      this.setEtapa('credentials', 'loading');
      // this.etapas.credentials = 'loading';
      const response = await NativeBiometric.getCredentials({
        server: this.biometricServer,
      });
      this.setEtapa('credentials', 'success');
      // this.etapas.credentials = 'success';
      return Promise.resolve(response);
    } catch (e: any) {
      this.setEtapa('credentials', 'error');
      // this.etapas.credentials = 'error';
      return Promise.reject('Nenhuma credencial biométrica disponível.');
    }
  }

  async authenticate(credenciais: Credenciais) {
    try {
      this.setEtapa('authentication', 'loading');
      // this.etapas.authentication = 'loading';
      const res = await lastValueFrom(this.authService.login(credenciais));
      this.setEtapa('authentication', 'success');
      // this.etapas.authentication = 'success';
      return Promise.resolve();
    } catch (e) {
      this.setEtapa('authentication', 'error');
      // this.etapas.authentication = 'error';
      return Promise.reject('Não foi possível autenticar.');
    }
  }

  async getTimeLine() {
    try {
      this.setEtapa('timeline', 'loading');
      // this.etapas.timeline = 'loading';
      const response: any = await lastValueFrom(this.dadosService.getTimeline());
      this.ponto.limparPontos();
      for (const batida of response.timeline) {
        this.ponto.addPonto({
          ...batida,
          worktime_clock: parseISO(batida.worktime_clock),
        });
      }
      this.setEtapa('timeline', 'success');
      // this.etapas.timeline = 'success';
      return Promise.resolve();
    } catch (e) {
      this.setEtapa('timeline', 'error');
      // this.etapas.timeline = 'error';
      return Promise.reject('Não foi possível obter a lista de ponto.');
    }
  }

  async authenticateOnInit(credenciais: Credenciais): Promise<void> {
    // try {
    const {latitude, longitude} = await this.getCoords();
    await this.authenticate(credenciais);
    await this.getTimeLine();
    if (!this.ponto.isMinInterval()) {
      await this.baterPonto(latitude, longitude);
    } else {
      const loadingMessage = await this.loadingController.create({
        message: 'É Necessário ter um mínimo de 30 minutos de diferença entre a batida anterior para registrar o ponto.',
        animated: true,
        spinner: 'lines',
        backdropDismiss: false,
        duration: 3000,
      });
      await loadingMessage.present();
    }
    // } catch (e) {
    //   this.toastController.create({
    //     message: `${e}`,
    //     duration: 3000,
    //     color: 'danger',
    //   }).then(toast => {
    //     toast.present().catch();
    //   });
    // }
  }

  async getCoords(): Promise<Coords> {
    try {
      const {coords}: any = await Geolocation.getCurrentPosition();
      return {latitude: coords.latitude, longitude: coords.longitude};
    } catch (e) {
      return {latitude: -15.7962774, longitude: -47.9481004};
    }
  }

  async baterPonto(latitude: number, longitude: number): Promise<boolean> {
    try {
      // this.etapas.ponto = 'loading';
      // const res = await lastValueFrom(this.dadosService.baterPonto({
      //   check_in: !this.ponto.trabalhando,
      //   latitude,
      //   longitude,
      // }));
      // this.etapas.ponto = 'success';
      return Promise.resolve(true);
    } catch (e) {
      // this.etapas.ponto = 'error';
      return Promise.reject('Não foi possível registrar o ponto.');
    }
  }

  async showToast(mensagem: string) {
    const toast = await this.toastController.create({
      message: mensagem,
      duration: 3000,
      color: 'danger',
    });
    await toast.present();
  }

  private setEtapa(name: string, status: STATUS): void {
    const item: Etapa | undefined = this.etapas.find(i => i.name === name);
    if (item !== undefined) {
      item.status = status;
      // return item;
    }
    // return null;
  }

  private async initialize() {
    try {
      const ready = await this.platform.ready();
      if (this.platform.is('capacitor')) {
        const result = await Promise.all([
          this.checkBiometryAvaliable(),
          this.getBiometryCredentials(),
        ]);
        if (result[0] === true && result[1]) {
          console.log('result: ', result);
          await this.authenticateOnInit(result[1]);
        }
      }
    } catch (e: any) {
      this.etapas.forEach(i => {
        if (i.status !== 'error') {
          i.status = 'error';
        }
      });
      await this.showToast(`${e}`);
    } finally {
      await lastValueFrom(timer(3000).pipe(take(1)));
      console.log('Terminei !!!!!!!!!!');
      // this.navCtrl.navigateRoot(['/home']).catch();
      // App.exitApp().catch();

      // setTimeout(() => {
      //   console.log('Terminei !!!!!!!!!!');
      //   // this.navCtrl.navigateRoot(['/home']).catch();
      //   // App.exitApp().catch();
      // }, 3000);
    }

    // this.platform.ready().then(async () => {
    //   if (this.platform.is('capacitor')) {
    //     Promise.all([
    //       this.checkBiometryAvaliable(),
    //       this.getBiometryCredentials(),
    //     ]).then(async r => {
    //       if (r[0] !== null && r[1]) {
    //         await this.authenticateOnInit(r[1]);
    //       }
    //       setTimeout(() => {
    //         console.log('Terminei !!!!!!!!!!');
    //         // this.navCtrl.navigateRoot(['/home']).catch();
    //         // App.exitApp().catch();
    //       }, 3000);
    //       // App.exitApp().catch();
    //     }).catch(e => {
    //       console.log('catch: ', e);
    //       // App.exitApp().catch();
    //     });
    //   }
    // });
  }
}
