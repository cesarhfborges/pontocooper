import {AfterViewInit, Component, OnInit} from '@angular/core';
import {DadosService} from '../core/services/dados.service';
import {AlertController, Platform} from '@ionic/angular';
import {AuthService} from '../core/services/auth.service';
import {StatusBar} from '@ionic-native/status-bar/ngx';
import {Ponto} from '../core/models/ponto';
import {Geolocation} from '@ionic-native/geolocation/ngx';
import {format, getHours, parseISO, set} from 'date-fns';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit, AfterViewInit {

  ponto: Ponto;

  dataAtual: Date;

  horasTrabalhadas: Date = set(new Date(), {hours: 0, minutes: 0, seconds: 0});

  coords = {
    lat: -15.7962774,
    lon: -47.9481004
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

  constructor(
    private dadosService: DadosService,
    private alertController: AlertController,
    private authService: AuthService,
    private platform: Platform,
    private statusBar: StatusBar,
    private geolocation: Geolocation
  ) {
    //#1da57a
    this.dataAtual = new Date();
    const batidas: Array<Date> = [];
    this.ponto = new Ponto(batidas);
    setInterval(() => {
      this.horasTrabalhadas = this.ponto.horasTrabalhadas;

      const start = set(new Date(), {
        hours: 0,
        minutes: 0,
        seconds: 0,
        milliseconds: 0
      });
    }, 1000);
  }

  get jornadaDiaria(): number {
    const val = Math.trunc(getHours(this.horasTrabalhadas) / 8 * 100);
    return val > 99 ? 100 : val;
  }

  ngOnInit(): void {
    this.getDados();
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

  getDados($event?): void {
    const dateNow: Date = new Date(Date.now());
    this.dadosService.getSummary(format(dateNow, 'yyyy'), format(dateNow, 'MM')).subscribe(
      response => {
        this.summary = {
          workingHours: response.working_hours,
          businessDays: response.business_days,
          hoursToWork: response.hours_to_work,
          remainingHours: response.remaining_hours
        };
      },
      error => {
        console.log(error);
      }
    );

    this.dadosService.getTimeline().subscribe(
      response => {
        this.ponto.limparPontos();
        for (const batida of response.timeline) {
          this.ponto.addPonto(parseISO(batida.worktime_clock));
        }
        setTimeout(() => {
          if ($event) {
            $event.target.complete();
          }
        }, 2000);
      },
      error => {
        console.log(error);
      }
    );

    this.dadosService.getBancoDeHoras().subscribe(
      response => {
        this.bancoDeHoras = response;
      },
      error => {
        console.log(error);
      }
    );
  }

  async registrarPonto() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Deseja confirmar Saída?',
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
            const r: boolean = teste.length > 0 ? teste[0] : false;
            alert.dismiss(r);
            return false;
          }
        }
      ],
      inputs: [
        {
          name: 'pausa',
          type: 'checkbox',
          label: 'Essa é minha pausa de no mínimo 30 minutos.',
          value: true,
          checked: false
        }
      ]
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
}
