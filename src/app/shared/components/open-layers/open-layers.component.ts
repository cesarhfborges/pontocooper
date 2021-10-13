import {AfterViewInit, Component, Input, OnInit} from '@angular/core';
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

@Component({
  selector: 'app-open-layers',
  templateUrl: './open-layers.component.html',
  styleUrls: ['./open-layers.component.scss'],
})
export class OpenLayersComponent implements OnInit, AfterViewInit {

  @Input() dados: Array<{ latitude: number; longitude: number }>;

  map: Map;

  constructor() {
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
        center: transform([-47.9690582, -15.8121796], 'EPSG:4326', new OSM().getProjection()),
        zoom: 11
      })
    });
    this.map.render();
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.map.updateSize();
      for (const {latitude, longitude} of this.dados) {
        this.map.addLayer(this.createPin(latitude, longitude));
      }
      // this.map.getView().setCenter(
      //   transform(
      //     [
      //       this.dados[this.dados.length - 1].longitude,
      //       this.dados[this.dados.length - 1].latitude
      //     ],
      //     'EPSG:4326',
      //     new OSM().getProjection()
      //   )
      // );
      if (this.dados?.length > 0) {
        const location: any = transform(
          [
            this.dados[this.dados.length - 1].longitude,
            this.dados[this.dados.length - 1].latitude
          ],
          'EPSG:4326',
          new OSM().getProjection()
        );
        this.flyTo(location);
      }
    }, 500);
  }

  private createPin(lat: number, long: number): VectorLayer<any> {
    const iconFeature = new Feature({
      geometry: new Point(transform([long, lat], 'EPSG:4326', new OSM().getProjection())),
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

  private flyTo(location, done?) {
    const duration = 2000;
    const zoom = this.map.getView().getZoom();
    let parts = 2;
    let called = false;
    const callback = (complete) => {
      --parts;
      if (called) {
        return;
      }
      if (parts === 0 || !complete) {
        called = true;
        done(complete);
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
        zoom: zoom - 1,
        duration: duration / 2,
      },
      {
        zoom,
        duration: duration / 2,
      },
      callback
    );
  }
}
