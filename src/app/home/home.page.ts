import {Component, OnDestroy, OnInit} from '@angular/core';
import {ViewWillEnter} from '@ionic/angular';
import {lastValueFrom, Observable, timer} from 'rxjs';
import {AuthService} from '../core/services/auth.service';
import {Usuario} from '../core/models/usuario';
import {DadosService} from '../core/services/dados.service';
import {format} from "date-fns";

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
  } = {
    profile: false,
    summary: false
  };
  perfil: Usuario | undefined;
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
    private authService: AuthService,
    private dadosService: DadosService,
  ) {
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
    Promise.all([
      this.getPerfil(),
      this.getSumario()
    ]).then(data => {
      console.log('finalizado !!!!');
      console.log(data);
      this.perfil = data[0];
      this.summary = {
        workingHours: data[1].working_hours,
        businessDays: data[1].business_days,
        hoursToWork: data[1].hours_to_work,
        remainingHours: data[1].remaining_hours
      };
    }).catch(e => {
      console.log('error: ', e);
    });
  }

  ngOnDestroy(): void {
    this.timer = undefined;
  }

  async getPerfil() {
    this.loading.profile = true;
    const request: any = this.authService.perfil();
    this.loading.profile = false;
    return await lastValueFrom<any>(request);
    // .subscribe({
    //   next: response => {
    //     this.perfil = response;
    //     console.log('perfil: ', response);
    //   },
    //   error: (error) => {
    //     console.warn('perfil error: ', error);
    //   }
    // });
  }

  async getSumario() {
    this.loading.summary = true;
    const request: any = this.dadosService.getSummary(format(this.dataAtual, 'yyyy'), format(this.dataAtual, 'MM'));
    this.loading.summary = false;
    return await lastValueFrom<any>(request);
  }

  teste() {
    console.warn('Click');
  }
}
