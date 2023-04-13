import {Component, OnInit} from '@angular/core';
import {environment} from '../../environments/environment';
import {PositionService} from '../shared/services/position.service';
import {PermissionStatus} from '@capacitor/geolocation/dist/esm/definitions';
import {Network} from '@capacitor/network';
// import { LocalNotifications} from '@ionic-native/local-notifications/ngx'

@Component({
  selector: 'app-development',
  templateUrl: './development.page.html',
  styleUrls: ['./development.page.scss'],
})
export class DevelopmentPage implements OnInit {

  versao = environment.appVersion;
  loading: {
    gps: boolean;
    network: boolean;
  } = {
    gps: true,
    network: true
  };
  gpsPermissions: PermissionStatus = {
    location: 'denied',
    coarseLocation: 'denied'
  };
  networkStatus: {
    connected: boolean;
    connectionType: string;
  } = {
    connected: false,
    connectionType: 'none'
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
    Promise.all([
      this.getPosition(),
      this.getNetworkStatus(),
    ]).catch();
  }

  async getNetworkStatus() {
    try {
      this.loading.network = true;
      this.networkStatus = await Network.getStatus();
    } catch (e) {
      this.networkStatus = {
        connectionType: 'none',
        connected: false
      };
    } finally {
      this.loading.network = false;
    }
  }

  async getPosition() {
    try {
      this.loading.gps = true;
      this.gpsPermissions = await this.positionService.checkPermissions();
    } catch (e) {
      this.gpsPermissions = {
        location: 'denied',
        coarseLocation: 'denied'
      };
    } finally {
      this.loading.gps = false;
    }
    // this.loading.gps = true;
    // this.positionService.checkPermissions().then(response => {
    //   this.gpsPermissions = response;
    // }).catch(() => {
    //   this.gpsPermissions = {
    //     location: 'denied',
    //     coarseLocation: 'denied'
    //   };
    // }).finally(() => {
    //   this.loading.gps = false;
    // });
  }
}
