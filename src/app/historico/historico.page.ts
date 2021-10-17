import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {DadosService} from '../core/services/dados.service';
import {getMonth, getYear} from 'date-fns';
import {filter, map, mergeMap, toArray} from 'rxjs/operators';
import {MenuController} from '@ionic/angular';
import {OpenLayersComponent} from '../shared/components/open-layers/open-layers.component';

@Component({
  selector: 'app-historico',
  templateUrl: './historico.page.html',
  styleUrls: ['./historico.page.scss'],
})
export class HistoricoPage implements OnInit, OnDestroy {

  @ViewChild(OpenLayersComponent, { static: false }) openLayers: OpenLayersComponent;

  hoje: Date;

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
    this.menu.enable(true, 'principal').then();
  }

  ngOnInit() {
    this.menu.enable(false, 'principal').then();
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
        this.openLayers.addLocations(response);
        this.loading.producao = false;
      }
    );
  }
}
