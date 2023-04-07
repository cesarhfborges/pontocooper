import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Router, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs';
import {SessionStorageService} from '../services/session-storage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService {

  constructor(
    private router: Router,
    private session: SessionStorageService
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
      if (this.session.isAuthenticated()) {
        if (routes.includes(rotaAtual)) {
          this.router.navigate(['/home']).catch();
          return false;
        }
        return true;
      } else {
        if (routes.includes(rotaAtual)) {
          return true;
        } else {
          this.router.navigate(['/login']).catch();
          return false;
        }
      }
    }
    return true;
  };
}
