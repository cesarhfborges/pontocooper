import {Component, OnInit} from '@angular/core';
import {environment} from '../../environments/environment';
import {PositionService} from '../shared/services/position.service';
import {PermissionStatus} from '@capacitor/geolocation/dist/esm/definitions';

@Component({
  selector: 'app-development',
  templateUrl: './development.page.html',
  styleUrls: ['./development.page.scss'],
})
export class DevelopmentPage implements OnInit {

  versao = environment.appVersion;
  loading: { gps: boolean } = {gps: true};
  gpsPermissions: PermissionStatus = {
    location: 'denied',
    coarseLocation: 'denied'
  };

  constructor(
    private positionService: PositionService
  ) {
  }

  get gpsStatusIcon() {
    if (this.loading.gps) {
      return 'hourglass-outline';
    }
    if (this.gpsPermissions.location === 'denied') {
      return 'close-circle-outline';
    }
    if (this.gpsPermissions.location === 'granted') {
      return 'checkmark-outline';
    }
    return 'alert-circle-outline';
  }

  get gpsStatusColor() {
    if (this.loading.gps) {
      return 'tertiary';
    }
    if (this.gpsPermissions.location === 'denied') {
      return 'danger';
    }
    if (this.gpsPermissions.location === 'granted') {
      return 'success';
    }
    return 'warning';
  }

  get gpsStatusText() {
    if (this.loading.gps) {
      return 'Carregando';
    }
    if (this.gpsPermissions.location === 'denied') {
      return 'Negada';
    }
    if (this.gpsPermissions.location === 'granted') {
      return 'Permitida';
    }
    return 'Não solicitada';
  }

  ngOnInit() {
    this.getPosition();
  }

  getPosition() {
    this.loading.gps = true;
    this.positionService.checkPermissions().then(response => {
      this.gpsPermissions = response;
    }).catch(() => {
      this.gpsPermissions = {
        location: 'denied',
        coarseLocation: 'denied'
      };
    }).finally(() => {
      this.loading.gps = false;
    });
  }
}
