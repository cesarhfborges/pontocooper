import {Component, OnDestroy, OnInit} from '@angular/core';
import {DadosService} from '../core/services/dados.service';
import {getMonth, getYear} from 'date-fns';
import {filter, map, mergeMap, toArray} from 'rxjs/operators';
import {MenuController} from '@ionic/angular';

@Component({
  selector: 'app-historico',
  templateUrl: './historico.page.html',
  styleUrls: ['./historico.page.scss'],
})
export class HistoricoPage implements OnInit, OnDestroy {

  hoje: Date;

  producao: any;

  loading: {
    producao: boolean;
  } = {
    producao: false
  };

  constructor(
    private dadosService: DadosService,
    private menu: MenuController
  ) {
  }

  ngOnDestroy(): void {
    this.menu.swipeGesture(true).then();
  }

  ngOnInit() {
    this.menu.swipeGesture(false).then();
    this.hoje = new Date();
    this.getDados();
  }

  getDados(): void {
    this.loading.producao = true;
    this.dadosService.getProducao(getYear(this.hoje), getMonth(this.hoje)).pipe(
      mergeMap((i: Array<any>) => i),
      filter((i: any) => i.timeline !== undefined && i.timeline !== null && i.timeline.length > 0),
      mergeMap((i: any) => i.timeline),
      filter((i: any) => i.latitude !== null),
      map((i: any) => ({latitude: i.latitude, longitude: i.longitude})),
      toArray()
    ).subscribe(
      response => {
        this.producao = response;
        this.loading.producao = false;
      }
    );
  }
}
