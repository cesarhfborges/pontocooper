import {Component, OnInit, ViewChild} from '@angular/core';
import {MenuController, ViewDidEnter, ViewDidLeave} from '@ionic/angular';
import {OpenLayersComponent} from '../shared/components/open-layers/open-layers.component';
import {DadosService} from '../core/services/dados.service';
import {getMonth, getYear} from 'date-fns';
import {filter, map, mergeMap, toArray} from 'rxjs';
import { Geolocation } from '@capacitor/geolocation';

@Component({
  selector: 'app-historico',
  templateUrl: './historico.page.html',
  styleUrls: ['./historico.page.scss'],
})
export class HistoricoPage implements OnInit, ViewDidEnter, ViewDidLeave {

  @ViewChild(OpenLayersComponent, {static: false}) openLayers: OpenLayersComponent | undefined;

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
  ) {
    this.hoje = new Date();
  }

  ngOnInit() {
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
        this.openLayers?.addLocations(response);
        this.loading.producao = false;
      }
    );
  }

  async posicaoAtual(): Promise<{ latitude: number; longitude: number }> {
    return await new Promise<{ latitude: number; longitude: number }>((resolve) => {
      Geolocation.getCurrentPosition().then((resp) => {
        resolve({latitude: resp.coords.latitude, longitude: resp.coords.longitude});
      }).catch(e => {
        resolve({latitude: -15.7962774, longitude: -47.9481004});
      });
    });
  }

  async menuControl(status: boolean) {
    if (await this.menu.isOpen()) {
      await this.menu.close();
    }
    await this.menu.enable(status, 'principal');
  }

  ionViewDidLeave(): void {
    this.menuControl(true).catch(e => console.log(e));
  }

  ionViewDidEnter(): void {
    this.menuControl(false).catch(e => console.log(e));
  }
}
