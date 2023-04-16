import {AfterViewInit, Component, OnInit} from '@angular/core';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import {OSM} from 'ol/source';
import {Icon, Style} from 'ol/style';
import {Feature} from 'ol';
import {Circle, Point} from 'ol/geom';
import VectorSource from 'ol/source/Vector';
import VectorLayer from 'ol/layer/Vector';
import {ScaleLine, Zoom} from 'ol/control';
import {transform} from 'ol/proj';
import {Observable, timer} from 'rxjs';

interface Position {
  latitude: number;
  longitude: number;
}

@Component({
  selector: 'app-open-layers',
  templateUrl: './open-layers.component.html',
  styleUrls: ['./open-layers.component.scss'],
})
export class OpenLayersComponent implements OnInit, AfterViewInit {

  map: Map | undefined;

  timer: Observable<number>;

  constructor() {
    this.timer = timer(1000, 1000);
  }

  static transformarCoordenadas(latitude: number, longitude: number): Array<number> {
    const projection: any = new OSM().getProjection();
    return transform([longitude, latitude], 'EPSG:4326', projection);
  }

  static createPin(latitude: number, longitude: number): VectorLayer<any> {
    const iconFeature = new Feature({
      geometry: new Point(OpenLayersComponent.transformarCoordenadas(latitude, longitude)),
    });

    const iconStyle = new Style({
      image: new Icon({
        anchor: [0.5, 46],
        anchorXUnits: 'fraction',
        anchorYUnits: 'pixels',
        src: 'assets/pin.png',
      }),
    });

    iconFeature.setStyle(iconStyle);

    const vectorSource = new VectorSource({
      features: [iconFeature],
    });

    return new VectorLayer({
      source: vectorSource,
    });
  }

  createPinMarker(latitude: number, longitude: number): VectorLayer<any> {
    const iconFeature = new Feature({
      geometry: new Circle(OpenLayersComponent.transformarCoordenadas(latitude, longitude), 50),
      name: 'GPSATUAL'
    });

    iconFeature.setGeometryName('PinMarker');

    iconFeature.setStyle(new Style({
      renderer: (coordinates, state) => {
        const ctx = state.context;
        console.log('CTX: ', ctx);
        ctx.beginPath();
        // const gradient = ctx.strokeStyle;
        // gradient.addColorStop(0, 'rgba(255,0,0,0)');
        // gradient.addColorStop(0.6, 'rgba(255,0,0,0.2)');
        // gradient.addColorStop(1, 'rgba(255,0,0,0.8)');
        // ctx.fillStyle = gradient;
        ctx.fill();
        ctx.strokeStyle = 'rgba(255, 0, 0, 1)';
        ctx.stroke();
      },
    }));

    const vectorSource = new VectorSource({
      features: [iconFeature],
    });

    return new VectorLayer({
      source: vectorSource,
    });
  }

  ngOnInit() {
    const mapEl = document?.getElementById('map');
    if (mapEl !== null) {
      const zoom = new Zoom();
      const scaleLine = new ScaleLine();
      this.map = new Map({
        controls: [
          zoom,
          scaleLine
        ],
        layers: [
          new TileLayer({
            source: new OSM(),
          })
        ],
        target: mapEl,
        view: new View({
          center: OpenLayersComponent.transformarCoordenadas(-15.8121796, -47.9690582),
          zoom: 11
        })
      });
    } else {
      throw new Error('Não foi possível inicializar a vizualização do mapa');
    }
  }

  ngAfterViewInit(): void {
    this.map?.addLayer(this.createPinMarker(-15.8951013, -48.116222));
    console.log('layers: ', this.map?.getLayers().getArray()[1].getLayersArray());
    this.timer.subscribe(() => {
      this.map?.updateSize();
      // this.horasTrabalhadas = this.ponto.horasTrabalhadas;
      // this.calculaValor(82);
      // console.log('layers: ', this.map.getLayers().getArray()[1]);
      // this.map.getLayers().getArray();
      // this.map.addLayer(this.createPinMarker(-15.8951013, -48.116222));
    });
  }

  addLocations(locations: Array<Position>): void {
    for (const {latitude, longitude} of locations) {
      this.map?.addLayer(OpenLayersComponent.createPin(latitude, longitude));
    }
    if (locations.length > 0) {
      const coords = OpenLayersComponent.transformarCoordenadas(
        locations[locations.length - 1].latitude,
        locations[locations.length - 1].longitude
      );
      this.flyTo(coords);
    }
  }

  posicaoAtual(coordenadas: Promise<{ latitude: number; longitude: number }>): void {
    coordenadas.then(r => {
      const coords = OpenLayersComponent.transformarCoordenadas(r.latitude, r.longitude);
      this.flyTo(coords);
    });
  }

  private flyTo(location: number[]) {
    const duration = 2000;
    const oldZoom = this.map?.getView().getZoom();
    let parts = 2;
    let called = false;
    const callback = (complete: any) => {
      --parts;
      if (called) {
        return;
      }
      if (parts === 0 || !complete) {
        called = true;
      }
    };
    this.map?.getView().animate(
      {
        center: location,
        duration,
      },
      callback
    );
    this.map?.getView().animate(
      {
        zoom: (oldZoom ?? 4) - 1,
        duration: duration / 2,
      },
      {
        zoom: 14,
        duration: duration / 2,
      },
      callback
    );
  }
}
