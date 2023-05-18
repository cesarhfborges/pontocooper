import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs';
import {AuthService} from '../services/auth.service';
import {SessionService} from '../state/session.service';
import { Location } from '@angular/common';
import {environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class JwtInterceptor implements HttpInterceptor {

  constructor(
    private authService: AuthService,
    private session: SessionService,
    private location: Location
  ) {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const isApiRequest = request.url.startsWith(this.location.prepareExternalUrl(`${environment.apiUrl}`));

    if (isApiRequest) {
      let customHeaders: HttpHeaders = new HttpHeaders();
      customHeaders = customHeaders.set('Content-Type', 'application/json').set('X-Requested-With', 'XMLHttpRequest');
      if (this.session.isLoggedIn()) {
        customHeaders = customHeaders.set('Authorization', `Bearer ${this.session.credentials.access}`);
      }
      const req = request.clone({headers: customHeaders});
      return next.handle(req);
    }
    return next.handle(request);
  }
}
