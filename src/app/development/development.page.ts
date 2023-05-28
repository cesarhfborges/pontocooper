import { Component, OnInit } from '@angular/core';
import { environment } from '../../environments/environment';
import { PositionService } from '../shared/services';
import { PermissionStatus } from '@capacitor/geolocation/dist/esm/definitions';
import { LocalNotificationSchema } from '@capacitor/local-notifications/dist/esm/definitions';
import { addSeconds, format } from 'date-fns';
import { Network } from '@capacitor/network';
import { LocalNotifications } from '@capacitor/local-notifications';
import { AuthenticateOptions, BiometricAuth, BiometryType } from '@aparajita/capacitor-biometric-auth';


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
    network: true,
  };
  gpsPermissions: PermissionStatus = {
    location: 'denied',
    coarseLocation: 'denied',
  };
  networkStatus: {
    connected: boolean;
    connectionType: string;
  } = {
    connected: false,
    connectionType: 'none',
  };
  notificationPermissions = false;
  biometryAvaliable: boolean = false;
  protected readonly window = window;

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
      this.getNotificationPermission(),
    ]).catch();
  }

  async getNetworkStatus() {
    try {
      this.loading.network = true;
      this.networkStatus = await Network.getStatus();
    } catch (e) {
      this.networkStatus = {
        connectionType: 'none',
        connected: false,
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
        coarseLocation: 'denied',
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

  async getNotificationPermission() {
    const permissionStatus = await LocalNotifications.checkPermissions();
    console.log(permissionStatus);
    this.notificationPermissions = permissionStatus.display === 'granted';
  }

  async requestNotificationPermission() {
    const permissionStatus = await LocalNotifications.checkPermissions();
    console.log('permissionStatus: ', permissionStatus);
    if (permissionStatus.display !== 'granted') {
      const request = await LocalNotifications.requestPermissions();
      console.log('request permission: ', request);
      this.notificationPermissions = request.display === 'granted';
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
        sound: 'cool.wav',
        lights: true,
        description: 'canal de teste de notificações',
        visibility: 1,
      });
      const schemas: LocalNotificationSchema[] = [
        {
          id: 97,
          title: 'Faltam 5 minutos para encerrar seu intervalo.',
          body: 'Tenha um ótimo dia de trabalho. ;)',
          largeBody: 'Tenha um ótimo dia de trabalho. ;)',
          smallIcon: 'favicon.png',
          groupSummary: true,
          group: 'aviso',
          // summaryText: 'teste de notificação - 1 - summaryText',
          channelId: 'teste',
          schedule: {
            at: addSeconds(new Date(), 20),
            allowWhileIdle: true,
          },
          attachments: [
            {
              id: '1',
              url: 'res:///assets/public/assets/pin.png',
            },
          ],
        },
        {
          id: 98,
          title: 'Seu tempo de intervalo se encerra no próximo minuto.',
          body: 'Tenha um ótimo dia de trabalho. ;)',
          largeBody: 'Tenha um ótimo dia de trabalho. ;)',
          largeIcon: 'favicon_large.png',
          groupSummary: true,
          group: 'aviso',
          // summaryText: 'teste de notificação - 1 - summaryText',
          channelId: 'teste',
          schedule: {
            at: addSeconds(new Date(), 24),
            allowWhileIdle: true,
          },
        },
        {
          id: 99,
          title: 'Seu tempo de intervalo acabou.',
          body: 'Tenha um ótimo dia de trabalho. ;)',
          largeBody: 'Tenha um ótimo dia de trabalho. ;)',
          groupSummary: true,
          group: 'aviso',
          // summaryText: 'teste de notificação - 1 - summaryText',
          smallIcon: 'favicon.png',
          largeIcon: 'favicon_large.png',
          channelId: 'teste',
          schedule: {
            at: addSeconds(new Date(), 28),
            allowWhileIdle: true,
          },
          attachments: [
            {
              id: '1',
              url: 'res:///public/assets/ping.png',
            },
          ],
        },
        // {
        //   id: 1,
        //   title: 'CooperSystem- 1 - Title',
        //   body: 'teste de notificação - 1 - body',
        //   largeBody: 'teste de notificação - 1 - largeBody',
        //   summaryText: 'teste de notificação - 1 - summaryText',
        //   channelId: 'ponto',
        //   schedule: {
        //     at: subMinutes(atDateTime, 5),
        //     allowWhileIdle: true
        //   },
        // },
      ];
      const schedule = await LocalNotifications.schedule({notifications: schemas});
      console.log('scheduled: ', schedule, format(addSeconds(new Date(), 20), 'dd/MM/yyyy HH:mm:ss'));
    } else {
      const request = await LocalNotifications.requestPermissions();
      console.log('request permissions: ', request);
    }
  }

  async checkBiometryAvaliable() {
    const res = await BiometricAuth.checkBiometry();
    console.log(res.isAvailable);
    this.biometryAvaliable = res.isAvailable;
  }

  async authenticate() {
    try {
      const options: AuthenticateOptions = {
        reason: 'reason',
        allowDeviceCredential: true,
        androidSubtitle: 'subtitle',
        androidTitle: 'title',
        cancelTitle: 'Cancelar',
        iosFallbackTitle: 'Fallback',
      };
      const res = await BiometricAuth.authenticate(options);
      console.log('response: ', res);
    } catch (e) {
      console.log('error: ', e);
    }
  }
}
