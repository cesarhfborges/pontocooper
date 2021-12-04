import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, CanActivateChild, Router, RouterStateSnapshot} from '@angular/router';
import {AuthService} from '../services/auth.service';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate, CanActivateChild {

  constructor(
    private router: Router,
    private authService: AuthService
  ) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Observable<boolean> | Promise<boolean> {
    return this.checkRoute(state);
  }

  canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Observable<boolean> | Promise<boolean> {
    return this.checkRoute(state);
  }

  private checkRoute = (state: RouterStateSnapshot): boolean => {
    if (state.url !== '/') {
      const routes = [
        'login',
      ];
      const rotaAtual = state.url.split('/').filter(i => i !== '')[0];
      if (this.authService.isAuthenticated()) {
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
