import {Component, OnInit} from '@angular/core';
import {AlertController, ViewWillEnter} from '@ionic/angular';
import {Usuario} from '../core/models/usuario';
import {AuthService} from '../core/services/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit, ViewWillEnter {

  perfil: Usuario | undefined;
  showAmount = false;
  loading = false;

  constructor(
    private authService: AuthService,
    private alertController: AlertController,
  ) {
  }

  ngOnInit() {
    console.log('executei o onInit do profile');
    this.getPerfil();
  }

  ionViewWillEnter(): void {
    console.log('executei o ionViewWillEnter do profile');
  }

  getPerfil(): void {
    this.loading = true;
    this.authService.perfil().subscribe(
      response => {
        this.perfil = response;
        this.loading = false;
      },
      error => {
        this.loading = false;
        console.log(error);
      }
    );
  }

  toggleAmount(): void {
    this.showAmount = !this.showAmount;
  }

  sair(): void {
    this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Deseja confirmar Saída?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Sair',
          handler: () => {
            this.authService.logout();
          }
        }
      ]
    }).then((alert: any) => {
      alert.present();
    });
  }
}
