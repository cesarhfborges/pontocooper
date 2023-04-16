import {Component, OnDestroy, OnInit} from '@angular/core';
import {ViewWillEnter} from '@ionic/angular';
import {lastValueFrom, Observable, timer} from 'rxjs';
import {AuthService} from '../core/services/auth.service';
import {Usuario} from '../core/models/usuario';
import {DadosService} from '../core/services/dados.service';
import {Summary} from '../core/interfaces/summary';
import {format, parseISO} from 'date-fns';
import {BancoDeHoras} from '../core/interfaces/banco-de-horas';
import {Batida} from '../core/models/batida';
import {Ponto} from '../core/models/ponto';

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
    const init = (async () => {
      await this.getPerfil();
      await this.getBancoDeHoras();
      await this.getSumario();
      await this.getTimeLine();
    });
    init().catch();
    // this.getPerfil().catch();
    // this.getBancoDeHoras().catch();
    // this.getSumario().catch();
    // this.getTimeLine().catch();
  }

  ngOnDestroy(): void {
    this.timer = undefined;
  }

  async getPerfil() {
    this.loading.profile = true;
    const request = this.authService.perfil();
    const response = await lastValueFrom<any>(request);
    this.perfil = response;
    this.loading.profile = false;
    return response;
  }

  async getSumario() {
    this.loading.summary = true;
    const request: any = this.dadosService.getSummary(format(this.dataAtual, 'yyyy'), format(this.dataAtual, 'MM'));
    const response = await lastValueFrom<any>(request);
    this.summary = {
      workingHours: response.working_hours,
      businessDays: response.business_days,
      hoursToWork: response.hours_to_work,
      remainingHours: response.remaining_hours
    };
    this.loading.summary = false;
  }

  async getBancoDeHoras() {
    this.loading.bancoDeHoras = true;
    const request = this.dadosService.getBancoDeHoras();
    this.bancoDeHoras = await lastValueFrom<any>(request);
    this.loading.bancoDeHoras = false;
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
    } catch (e) {
      // const toast = await this.toastController.create({
      //   message: 'Erro ao obter linha do tempo, verifique a rede.',
      //   duration: 2000,
      //   color: 'danger'
      // });
      // await toast.present();
    }
  }

  teste() {
    console.warn('Click');
  }
}
