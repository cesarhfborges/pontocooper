import { Component, OnDestroy, OnInit } from '@angular/core';
import { Network } from '@capacitor/network';
import { ConnectionStatus } from '@capacitor/network/dist/esm/definitions';
import { Router } from '@angular/router';
import { NavController, Platform } from '@ionic/angular';
import { ScreenOrientation } from '@capacitor/screen-orientation';
import { environment } from '../environments/environment';
import { AppLauncher } from '@capacitor/app-launcher';
import { AndroidShortcuts } from 'capacitor-android-shortcuts';
import { SessionService } from './core/state/session.service';
import { ShortcutItem } from 'capacitor-android-shortcuts/dist/esm/definitions';
import { ICONS_PACK } from './shared/icons/icons-pack';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {

  networkStatus: ConnectionStatus = {
    connected: true,
    connectionType: 'unknown',
  };

  constructor(
    private router: Router,
    private navCtrl: NavController,
    private platform: Platform,
    private session: SessionService,
  ) {
  }

  ngOnInit(): void {
    this.platform.ready().then(async () => {
      if (this.platform.is('capacitor')) {
        if (this.platform.is('android') || this.platform.is('ios')) {
          Promise.all([
            Network.getStatus(),
            AppLauncher.canOpenUrl({url: 'br.com.coopersystem.portal'}),
            environment.production ? ScreenOrientation.lock({orientation: 'portrait'}) : ScreenOrientation.unlock(),
            this.addDynamicShortCuts(),
            this.listenShortCuts(),
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

  ngOnDestroy(): void {
    AndroidShortcuts.removeAllListeners().catch();
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

  private async addDynamicShortCuts(): Promise<void> {
    const {result} = await AndroidShortcuts.isDynamicSupported();
    if (result) {
      const shortCuts: ShortcutItem[] = [
        {
          id: 'ponto',
          shortLabel: 'Bater Ponto',
          longLabel: 'Registrar ponto',
          icon: {
            type: 'Bitmap',
            name: ICONS_PACK.TICKET,
          },
          data: 'ponto',
        },
        {
          id: 'producao',
          shortLabel: 'Minha produção',
          longLabel: 'Minha produção',
          icon: {
            type: 'Bitmap',
            name: ICONS_PACK.CALENDAR,
          },
          data: 'producao',
        },
        {
          id: 'historico',
          shortLabel: 'Histórico(GPS)',
          longLabel: 'Histórico(GPS)',
          icon: {
            type: 'Bitmap',
            name: ICONS_PACK.GPS,
          },
          data: 'historico',
        },
        {
          id: 'ferias-abonos',
          shortLabel: 'Férias e abonos',
          longLabel: 'Férias e abonos',
          icon: {
            type: 'Bitmap',
            name: ICONS_PACK.BEACH,
          },
          data: 'ferias-abonos',
        },
        {
          id: 'perfil',
          shortLabel: 'Perfil',
          longLabel: 'Perfil',
          icon: {
            type: 'Bitmap',
            name: ICONS_PACK.PERSON,
          },
          data: 'profile',
        },
      ];
      await AndroidShortcuts.setDynamic({
        items: shortCuts,
      });
    }
    return Promise.resolve();
  }

  private async listenShortCuts() {
    const dynamicSupported = await AndroidShortcuts.isDynamicSupported();
    const pinnedSupported = await AndroidShortcuts.isPinnedSupported();
    if (dynamicSupported.result || pinnedSupported.result) {
      await AndroidShortcuts.addListener('shortcut', async listen => {
        this.router.navigate([`${listen.data}`]).catch();
      });
    }
  }
}
