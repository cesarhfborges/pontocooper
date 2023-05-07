import {Component, OnInit} from '@angular/core';
import {Network} from '@capacitor/network';
import {ConnectionStatus} from "@capacitor/network/dist/esm/definitions";
import {Router} from "@angular/router";
import {NavController} from "@ionic/angular";

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
    private navCtrl: NavController
  ) {
  }

  ngOnInit(): void {
    Promise.all([
      Network.getStatus(),
    ]).then((response) => {
      this.networkStatus = response[0];
      this.navigate();
      Network.addListener('networkStatusChange', status => {
        this.networkStatus = status;
        this.navigate();
      });
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
