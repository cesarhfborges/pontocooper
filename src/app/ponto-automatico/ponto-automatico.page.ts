import { Component, OnInit } from '@angular/core';
import { LoadingController, NavController, Platform, ToastController, ViewWillEnter } from '@ionic/angular';
import { ToastsService } from '../shared/services';
import { NativeBiometric } from 'capacitor-native-biometric';
import { Credentials } from 'capacitor-native-biometric/dist/esm/definitions';
import { AuthService, Credenciais } from '../core/services/auth.service';
import { lastValueFrom } from 'rxjs';
import { Coords } from '../shared/models';
import { Geolocation } from '@capacitor/geolocation';
import { DadosService } from '../core/services/dados.service';
import { Ponto } from '../core/models/ponto';
import { Batida } from '../core/models/batida';
import { parseISO } from 'date-fns';

@Component({
  selector: 'app-ponto-automatico',
  templateUrl: './ponto-automatico.page.html',
  styleUrls: ['./ponto-automatico.page.scss'],
})
export class PontoAutomaticoPage implements OnInit, ViewWillEnter {

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
    this.platform.ready().then(async () => {
      if (this.platform.is('capacitor')) {

        Promise.all([
          this.checkBiometryAvaliable(),
          this.getBiometryCredentials(),
        ]).then(async r => {
          if (r[0] && r[1]) {
            this.authenticateOnInit(r[1]).catch();
          }
        }).catch(e => {
          console.log('catch: ', e);
        });
      }
    });
  }

  async checkBiometryAvaliable() {
    try {
      const {isAvailable} = await NativeBiometric.isAvailable();
      return Promise.resolve(isAvailable);
    } catch (e) {
      return Promise.reject(false);
    }
  }

  async getBiometryCredentials(): Promise<Credentials | null> {
    try {
      const response = await NativeBiometric.getCredentials({
        server: this.biometricServer,
      });
      return Promise.resolve(response);
    } catch (e: any) {
      return Promise.resolve(null);
    }
  }

  async authenticate(credenciais: Credenciais) {
    try {
      const res = await lastValueFrom(this.authService.login(credenciais));
      return Promise.resolve();
    } catch (e) {
      return Promise.reject('Não foi possível autenticar.')
    }
  }

  async getTimeLine() {
    try {
      const response: any = await lastValueFrom(this.dadosService.getTimeline());
      this.ponto.limparPontos();
      for (const batida of response.timeline) {
        this.ponto.addPonto({
          ...batida,
          worktime_clock: parseISO(batida.worktime_clock),
        });
      }
      return Promise.resolve();
    } catch (e) {
      return Promise.reject('Não foi possível obter a lista de ponto.');
    }
  }

  async authenticateOnInit(credenciais: Credenciais): Promise<void> {
    try {
      const loading = await this.loadingController.create({
        cssClass: 'my-custom-class',
        message: 'Autenticando',
        backdropDismiss: false,
        keyboardClose: false,
        showBackdrop: true,
        animated: true,
        spinner: 'bubbles',
      });
      await loading.present();
      const {latitude, longitude} = await this.getCoords();
      await this.authenticate(credenciais);
      await this.getTimeLine();
      await loading?.dismiss();
      if (!this.ponto.isMinInterval()) {
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
        await lastValueFrom(this.dadosService.baterPonto({
          check_in: !this.ponto.trabalhando,
          latitude,
          longitude,
        }));
        await loading?.dismiss();
        const toast: any = await this.toastController.create({
          message: `Ponto registrado com sucesso ;)`,
          duration: 3000,
          color: 'success',
        });
        toast.present();
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
    } catch (e) {
      console.log(e);
      this.toastController.create({
        message: 'error',
        duration: 3000,
        color: 'danger',
      }).then(toast => {
        toast.present().catch();
      });
    } finally {
      setTimeout(() => {
        this.navCtrl.navigateRoot(['/home']).catch();
      }, 3000);
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

  private async showLoading(message: string, duration: number = 2500) {
    const loading = await this.loadingController.create({
      message,
      duration,
      backdropDismiss: false,
      keyboardClose: false,
      showBackdrop: true,
      animated: true,
      spinner: 'bubbles',
      cssClass: 'my-custom-class',
    });
    return Promise.resolve(loading);
    // await loading.present();
  }
}
