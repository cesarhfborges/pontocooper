import {AfterViewInit, Component, OnInit} from '@angular/core';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import {OSM} from 'ol/source';
import {Icon, Style} from 'ol/style';
import {Feature} from 'ol';
import {Point} from 'ol/geom';
import VectorSource from 'ol/source/Vector';
import VectorLayer from 'ol/layer/Vector';
import {transform} from 'ol/proj';

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

  map: Map;

  constructor() {
  }

  static transformarCoordenadas(latitude, longitude): Array<number> {
    const projection: any = new OSM().getProjection();
    return transform([longitude, latitude], 'EPSG:4326', projection);
  }

  static createPin(latitude: number, longitude: number): VectorLayer<any> {
    const iconFeature = new Feature({
      geometry: new Point(OpenLayersComponent.transformarCoordenadas(latitude, longitude)),
      name: 'Null Island',
      population: 4000,
      rainfall: 500,
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

  ngOnInit() {
    this.map = new Map({
      layers: [
        new TileLayer({
          source: new OSM(),
        })
      ],
      target: document.getElementById('map'),
      view: new View({
        center: OpenLayersComponent.transformarCoordenadas(-15.8121796, -47.9690582),
        zoom: 11
      })
    });
    this.map.render();
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.map.updateSize();
    }, 500);
  }

  addLocations(locations: Array<Position>): void {
    for (const {latitude, longitude} of locations) {
      this.map.addLayer(OpenLayersComponent.createPin(latitude, longitude));
    }
    if (locations.length > 0) {
      this.flyTo(OpenLayersComponent.transformarCoordenadas(
          locations[locations.length - 1].latitude,
          locations[locations.length - 1].longitude
        )
      );
    }
  }

  private flyTo(location) {
    const duration = 2000;
    const oldZoom = this.map.getView().getZoom();
    let parts = 2;
    let called = false;
    const callback = (complete) => {
      --parts;
      if (called) {
        return;
      }
      if (parts === 0 || !complete) {
        called = true;
      }
    };
    this.map.getView().animate(
      {
        center: location,
        duration,
      },
      callback
    );
    this.map.getView().animate(
      {
        zoom: oldZoom - 1,
        duration: duration / 2,
      },
      {
        zoom: oldZoom,
        duration: duration / 2,
      },
      callback
    );
  }
}
