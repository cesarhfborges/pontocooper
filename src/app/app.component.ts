import {Component, OnInit} from '@angular/core';
import {Network} from '@capacitor/network';
import {ConnectionStatus} from '@capacitor/network/dist/esm/definitions';
import {Router} from '@angular/router';
import {NavController, Platform} from '@ionic/angular';
import {ScreenOrientation} from '@capacitor/screen-orientation';
import {environment} from '../environments/environment';
import {AppLauncher} from '@capacitor/app-launcher';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {

  networkStatus: ConnectionStatus = {
    connected: true,
    connectionType: 'unknown'
  };

  constructor(
    private router: Router,
    private navCtrl: NavController,
    private platform: Platform,
  ) {
  }

  ngOnInit(): void {
    this.platform.ready().then(async () => {
      if (this.platform.is('capacitor')) {
        if (this.platform.is('android') || this.platform.is('ios')) {
          Promise.all([
            Network.getStatus(),
            AppLauncher.canOpenUrl({ url: 'br.com.coopersystem.portal' }),
            environment.production ? ScreenOrientation.lock({orientation: 'portrait'}) : ScreenOrientation.unlock()
          ]).then((response) => {
            this.networkStatus = response[0];
            console.log('Can open url: ', response[1]);
            this.navigate();
            Network.addListener('networkStatusChange', status => {
              this.networkStatus = status;
              this.navigate();
            });
          });
        }
      }
    }).catch(e => {
    });
  }

  navigate(): void {
    if (!this.networkStatus.connected) {
      if (this.router.url !== '/offline') {
        this.navCtrl.navigateRoot(['/offline']).catch();
        return;
      }
    } else {
      if (this.router.url === '/offline') {
        this.navCtrl.navigateRoot(['/home']).catch();
        return;
      }
    }
  }
}
