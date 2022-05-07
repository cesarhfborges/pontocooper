import {Component, OnInit} from '@angular/core';
import {Geolocation, GeolocationOptions} from '@ionic-native/geolocation/ngx';
import {LoadingController, ToastController} from '@ionic/angular';
import {Ponto} from '../core/models/ponto';
import {DadosService} from '../core/services/dados.service';
import {Router} from '@angular/router';
import {parseISO} from 'date-fns';
import {delay, pluck} from 'rxjs/operators';

type PredefinedColors =
  'primary'
  | 'secondary'
  | 'tertiary'
  | 'success'
  | 'warning'
  | 'danger'
  | 'light'
  | 'medium'
  | 'dark';

@Component({
  selector: 'app-ponto-automatico',
  templateUrl: './ponto-automatico.page.html',
  styleUrls: ['./ponto-automatico.page.scss'],
})
export class PontoAutomaticoPage implements OnInit {

  ponto: Ponto = new Ponto([]);

  gps: { latitude: number; longitude: number };

  constructor(
    private router: Router,
    private dadosService: DadosService,
    private geolocation: Geolocation,
    private loadingController: LoadingController,
    private toastController: ToastController,
  ) {
  }

  ngOnInit() {
    this.init().then(() => {
      this.showToast();
    }).catch((err) => {
      this.showToast('Não foi possível registrar o ponto', 'danger');
    }).finally(() => {
      this.router.navigate(['/home']).catch();
    });
  }

  async init() {
    // const loading = await this.loadingScreen('Aguarde registrando ponto...');
    // await loading.present();
    const {latitude, longitude} = await this.getCoords();
    this.gps.latitude = latitude;
    this.gps.longitude = longitude;
    const timeline = await this.dadosService.getTimeline().pipe(
      delay(10000),
      pluck('timeline'),
    ).toPromise();
    for (const batida of timeline) {
      this.ponto.addPonto({
        ...batida,
        worktime_clock: parseISO(batida.worktime_clock)
      });
    }
    // await this.registrarPonto();
    // await loading.dismiss();
  }

  async registrarPonto() {
    return await this.dadosService.baterPonto({
      check_in: !this.ponto.trabalhando,
      latitude: this.gps.latitude,
      longitude: this.gps.longitude
    }).toPromise();
  }

  showToast(
    mensagem: string = `${this.ponto?.trabalhando ? 'Entrada' : 'Saída'} registrada com sucesso!`,
    type: PredefinedColors = 'success',
    time: number = 3000,
  ) {
    this.toastController.create({
      message: mensagem,
      duration: time,
      color: type,
    }).then(toast => toast.present());
  }

  private async loadingScreen(mensagem = 'Aguarde...') {
    return await this.loadingController.create({
      message: mensagem,
      cssClass: 'my-custom-class',
      backdropDismiss: false,
      showBackdrop: true,
      animated: true,
      keyboardClose: false,
      spinner: 'bubbles',
    });
  }

  private async getCoords(): Promise<{ latitude: number; longitude: number }> {
    try {
      const opts: GeolocationOptions = {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 30000
      };
      const {coords} = await this.geolocation.getCurrentPosition(opts);
      return coords;
    } catch (e) {
      return {
        latitude: -15.7962774,
        longitude: -47.9481004
      };
    }
  }
}
