import {AuthService} from '../services/auth.service';
import {LoadingController} from '@ionic/angular';
import {delay} from 'rxjs/operators';

const appInitializer = (authService: AuthService, loadingController: LoadingController) => () => new Promise<void>(resolve => {
  if (authService.isAuthenticated && authService.getRefreshToken() !== undefined && authService.getRefreshToken() !== null) {
    loadingController.create({
      cssClass: 'my-custom-class',
      message: 'Aguarde...',
      backdropDismiss: false,
      showBackdrop: true,
      animated: true,
      keyboardClose: false,
      spinner: 'bubbles',
    }).then((l: any) => {
      l.present();
      authService.refreshToken(authService.getRefreshToken())
        .pipe(delay(900))
        .subscribe(
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
