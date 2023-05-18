import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Router, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs';
import {SessionService} from '../state/session.service';
import {NavController} from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService {

  constructor(
    // private router: Router,
    private navCtrl: NavController,
    private session: SessionService
  ) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Observable<boolean> | Promise<boolean> {
    return this.checkRoute(state);
  }

  canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Observable<boolean> | Promise<boolean> {
    return this.checkRoute(state);
  }

  private checkRoute(state: RouterStateSnapshot): boolean {
    if (state.url !== '/') {
      const routes = [
        'login',
      ];
      const rotaAtual = state.url.split('/').filter(i => i !== '')[0];
      if (this.session.isLoggedIn()) {
        if (routes.includes(rotaAtual)) {
          this.navCtrl.navigateRoot(['/home']).catch();
          return false;
        }
        return true;
      } else {
        if (routes.includes(rotaAtual)) {
          return true;
        } else {
          this.navCtrl.navigateRoot(['/login']).catch();
          return false;
        }
      }
    }
    return true;
  };
}
