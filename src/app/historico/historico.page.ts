import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {DadosService} from '../core/services/dados.service';
import {MenuController} from '@ionic/angular';
import {OpenLayersComponent} from '../shared/components/open-layers/open-layers.component';
import {Geolocation} from '@ionic-native/geolocation/ngx';
import {filter, map, mergeMap, toArray} from 'rxjs/operators';
import {getMonth, getYear} from 'date-fns';

@Component({
  selector: 'app-historico',
  templateUrl: './historico.page.html',
  styleUrls: ['./historico.page.scss'],
})
export class HistoricoPage implements OnInit, OnDestroy {

  @ViewChild(OpenLayersComponent, {static: false}) openLayers: OpenLayersComponent;

  hoje: Date;

  coords = {
    lat: -15.7962774,
    lon: -47.9481004
  };

  loading: {
    producao: boolean;
  } = {
    producao: false
  };

  constructor(
    private dadosService: DadosService,
    private menu: MenuController,
    private geolocation: Geolocation,
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

  async posicaoAtual(): Promise<{ latitude: number; longitude: number }> {
    return await new Promise<{latitude: number; longitude: number}>((resolve) => {
      this.geolocation.getCurrentPosition().then((resp) => {
        resolve({ latitude: resp.coords.latitude, longitude: resp.coords.longitude });
      }).catch(e => {
        resolve({latitude: -15.7962774, longitude: -47.9481004});
      });
    });
  }
}
