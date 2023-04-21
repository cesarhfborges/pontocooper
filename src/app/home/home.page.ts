import {Component, OnDestroy, OnInit} from '@angular/core';
import {AlertController, AlertInput, LoadingController, ViewWillEnter} from '@ionic/angular';
import {delay, Observable, timer} from 'rxjs';
import {AuthService} from '../core/services/auth.service';
import {Usuario} from '../core/models/usuario';
import {DadosService} from '../core/services/dados.service';
import {Summary} from '../core/interfaces/summary';
import {format, parseISO} from 'date-fns';
import {BancoDeHoras} from '../core/interfaces/banco-de-horas';
import {Batida} from '../core/models/batida';
import {Ponto} from '../core/models/ponto';
import {environment} from "../../environments/environment";

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit, ViewWillEnter, OnDestroy {

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


  constructor(
    private authService: AuthService,
    private dadosService: DadosService,
    private alertController: AlertController,
    private loadingController: LoadingController,
  ) {
    const batidas: Array<Batida> = [];
    this.ponto = new Ponto(batidas);
  }

  ngOnInit(): void {
    console.log('executei o onInit da home');
    this.dataAtual = new Date();
    this.timer = timer(1000, 1000);
    this.timer.subscribe({
      next: () => {
        this.dataAtual = new Date();
        // console.log(this.dataAtual);
        // this.horasTrabalhadas = this.ponto.horasTrabalhadas;
        // // TODO: AJUSTAR AQUI
        // if (this.perfil) {
        //   this.calculaValor(this.perfil.hourly_rate as number);
        // }
      }
    });
  }

  ionViewWillEnter(): void {
    console.log('executei o ionViewWillEnter da home');
    // const init = (async () => {
    //   await this.getPerfil();
    //   await this.getBancoDeHoras();
    //   await this.getSumario();
    //   await this.getTimeLine();
    // });
    // init().catch();
    this.getPerfil();
    this.getBancoDeHoras();
    this.getSumario();
    this.getTimeLine();
  }

  ngOnDestroy(): void {
    this.timer = undefined;
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
      // complete: () => {
      //   console.log('===================================================================');
      //   console.log('chamei o metodo complete da Home');
      // }
    });
    // const request = this.authService.perfil();
    // const response = await lastValueFrom<any>(request);
    // this.perfil = response;
    // this.loading.profile = false;
    // return response;
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
    // const request: any = this.dadosService.getSummary(format(this.dataAtual, 'yyyy'), format(this.dataAtual, 'MM'));
    // const response = await lastValueFrom<any>(request);
    // this.summary = {
    //   workingHours: response.working_hours,
    //   businessDays: response.business_days,
    //   hoursToWork: response.hours_to_work,
    //   remainingHours: response.remaining_hours
    // };
    // this.loading.summary = false;
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
    // const request = this.dadosService.getBancoDeHoras();
    // this.bancoDeHoras = await lastValueFrom<any>(request);
    // this.loading.bancoDeHoras = false;
  }

  getTimeLine() {
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
      },
    });
    // try {
    //   this.loading.timeline = true;
    //   const timeline = await this.dadosService.getTimeline().toPromise();
    //   this.ponto.limparPontos();
    //   for (const batida of timeline.timeline) {
    //     this.ponto.addPonto({
    //       ...batida,
    //       worktime_clock: parseISO(batida.worktime_clock)
    //     });
    //   }
    //   this.loading.timeline = false;
    // } catch (e) {
    //   // const toast = await this.toastController.create({
    //   //   message: 'Erro ao obter linha do tempo, verifique a rede.',
    //   //   duration: 2000,
    //   //   color: 'danger'
    //   // });
    //   // await toast.present();
    // }
  }

  teste() {
    console.warn('Click');
  }

  async registrarPonto() {
    try {
      const input: AlertInput = {
        name: 'pausa',
        type: 'checkbox',
        label: `Essa é minha pausa de $VALOR_TESTE.`,
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
            handler: () => {
              alert.dismiss(undefined, 'cancelar');
              return false;
            }
          },
          {
            text: 'Registrar',
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

        this.ponto.baterPonto(data);




        await loading.dismiss();

        // await this.cancelarNotificacoes();


      }
    } catch (e) {

    }
  }

  protected readonly environment = environment;
}
