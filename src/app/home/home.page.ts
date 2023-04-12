import {Component, OnDestroy, OnInit} from '@angular/core';
import {ViewWillEnter} from '@ionic/angular';
// import {SessionStorageService} from '../core/services/session-storage.service';
import {Observable, timer} from 'rxjs';
import {AuthService} from '../core/services/auth.service';
import {Usuario} from '../core/models/usuario';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit, ViewWillEnter, OnDestroy {

  dataAtual: Date = new Date();
  timer: Observable<number> | undefined;
  perfil: Usuario | undefined;


  constructor(
    // private session: SessionStorageService,
    private authService: AuthService,
  ) {
  }

  ngOnInit(): void {
    console.log('executei o onInit da home');
  }

  ionViewWillEnter(): void {
    console.log('executei o ionViewWillEnter da home');
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
    this.getPerfil();
  }

  ngOnDestroy(): void {
    this.timer = undefined;
  }

  getPerfil() {
    this.authService.perfil().subscribe({
      next: response => {
        this.perfil = response;
        console.log('perfil: ', response);
      },
      error: (error) => {
        console.warn('perfil error: ', error);
      }
    });
  }

  teste() {
    console.warn('Click');
  }
}
