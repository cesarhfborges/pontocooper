import {Component, OnInit} from '@angular/core';
import {AlertController, ViewWillEnter} from '@ionic/angular';
import {Usuario} from '../core/models/usuario';
import {AuthService} from '../core/services/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  perfil: Usuario | undefined;
  showAmount = false;
  loading = false;

  constructor(
    private authService: AuthService,
    private alertController: AlertController,
  ) {
  }

  ngOnInit() {
    this.getPerfil();
  }

  getPerfil(): void {
    this.loading = true;
    this.authService.perfil().subscribe({
      next: (response) => {
        this.perfil = response;
        this.loading = false;
      },
      error: (error) => {
        this.loading = false;
        console.log(error);
      }
    });
  }

  getAvatar(): string {
    if (this.perfil?.avatar) {
      const regex: RegExp = new RegExp('b\'([^\']+)\'');
      const match: RegExpMatchArray | null = this.perfil.avatar.match(regex);
      if (match !== null) {
        return `data:image/png;base64,${match[1]}`;
      }
    }
    return '';
  }

  toggleAmount(): void {
    this.showAmount = !this.showAmount;
  }

  sair(): void {
    this.alertController.create({
      cssClass: 'alerta',
      header: 'Deseja confirmar Saída?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'btn-cancel'
        },
        {
          text: 'Sair',
          handler: () => {
            this.authService.logout();
          },
          cssClass: 'btn-done'
        }
      ]
    }).then((alert: any) => {
      alert.present();
    });
  }
}
