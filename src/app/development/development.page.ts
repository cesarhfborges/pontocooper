import {Component, OnInit} from '@angular/core';
import {environment} from '../../environments/environment';
import {PositionService} from '../shared/services/position.service';
import {PermissionStatus} from '@capacitor/geolocation/dist/esm/definitions';
import {LocalNotificationSchema} from '@capacitor/local-notifications/dist/esm/definitions';
import {addMinutes, addSeconds, format} from 'date-fns';
import {Network} from '@capacitor/network';
import {LocalNotifications} from '@capacitor/local-notifications';


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
    private positionService: PositionService,
    // private localNotifications: LocalNotifications
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

  async checkNotificationPermissions() {
    const permissionStatus = await LocalNotifications.checkPermissions();
    console.log('permissionStatus: ', permissionStatus);
    if (permissionStatus.display !== 'granted') {
      const request = await LocalNotifications.requestPermissions();
      console.log('request permission: ', request);
    }
  }

  async scheduleNotification() {
    const permissionStatus = await LocalNotifications.checkPermissions();
    if (permissionStatus.display === 'granted') {
      await LocalNotifications.removeAllDeliveredNotifications();
      await LocalNotifications.deleteChannel({id: 'teste'});
      await LocalNotifications.createChannel({
        id: 'teste',
        name: 'notificações de teste',
        vibration: true,
        importance: 5,
        // sound: 'cool.wav',
        // sound: 'cool',
        // sound: 'file://assets/sounds/cool.wav',
        // sound: 'file://assets/public/assets/sounds/cool.wav',
        // sound: 'res://raw/cool.wav',
        // sound: './public/assets/sounds/cool.wav',
        // sound: 'android.resource://br.com.coopersystem.portal/raw/cool.wav',
        sound: 'android_asset/public/assets/sounds/cool.wav',
        lights: true,
        description: 'canal de teste de notificações',
        visibility: 1
      });
      const schema: LocalNotificationSchema = {
        id: 2,
        title: 'CooperSystem',
        body: 'teste de notificação',
        largeBody: 'teste de notificação com texto grande para ser exibida de forma expandida. seção expandida.',
        summaryText: 'teste de notificação com texto grande para ser exibida de forma expandida. seção summary.',
        // sound: './public/assets/sounds/cool.wav',
        // sound: 'cool',
        // sound: 'android.resource://br.com.coopersystem.portal/raw/cool.wav',
        channelId: 'teste',
        schedule: {
          at: addSeconds(new Date(), 40),
          allowWhileIdle: true
        }
      };
      const schedule = await LocalNotifications.schedule({notifications: [schema]});
      console.log('scheduled: ', schedule, format(addSeconds(new Date(), 40), 'dd/MM/yyyy HH:mm:ss'));
    } else {
      const request = await LocalNotifications.requestPermissions();
      console.log('request permissions: ', request);
    }
  }
}
