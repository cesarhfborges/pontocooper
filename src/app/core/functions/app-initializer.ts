import {AuthService} from '../services/auth.service';
import {LoadingController} from '@ionic/angular';

const appInitializer = (authService: AuthService, loadingController: LoadingController) => () => new Promise<void>(resolve => {
  if (authService.isAuthenticated && authService.getRefreshToken() !== undefined && authService.getRefreshToken() !== null) {
    loadingController.create({
      cssClass: 'my-custom-class',
      message: 'Aguarde...',
      backdropDismiss: false,
      keyboardClose: false,
      spinner: 'bubbles',
    }).then((l: any) => {
      l.present();
      authService.refreshToken(authService.getRefreshToken()).subscribe(
        () => {
          l.dismiss();
        },
        () => {
          l.dismiss();
        }
      ).add(resolve);
    });
  } else {
    resolve();
  }
});

export {appInitializer};
