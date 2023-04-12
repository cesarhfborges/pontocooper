import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs';
import {AuthService} from '../services/auth.service';
import {SessionService} from '../state/session.service';

@Injectable({
  providedIn: 'root'
})
export class JwtInterceptor implements HttpInterceptor {

  constructor(
    private authService: AuthService,
    private session: SessionService
  ) {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let customHeaders: HttpHeaders = new HttpHeaders();
    customHeaders = customHeaders.set('Content-Type', 'application/json').set('X-Requested-With', 'XMLHttpRequest');
    if (this.session.isLoggedIn() && this.session.credentials !== null) {
      customHeaders = customHeaders.set('Authorization', `Bearer ${this.session.credentials.access}`);
    }
    const req = request.clone({withCredentials: true, headers: customHeaders});
    return next.handle(req);
  }
}
