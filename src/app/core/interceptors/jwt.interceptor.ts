import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs';
import {AuthService} from '../services/auth.service';
import {environment} from '../../../environments/environment';
import {SessionStorageService} from '../services/session-storage.service';

@Injectable({
  providedIn: 'root'
})
export class JwtInterceptor implements HttpInterceptor {

  constructor(
    private authService: AuthService,
    private session: SessionStorageService
  ) {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const headers: HttpHeaders = new HttpHeaders();
    headers.append('Content-Type', 'application/json');
    headers.append('X-Requested-With', 'XMLHttpRequest');

    const isApiUrl = request.url.startsWith(environment.apiUrl);
    if (isApiUrl) {
      if (this.session.isAuthenticated()) {
        request = request.clone({
          setHeaders: {
            ...headers,
            // authorization: `Bearer ${this.authService.getToken()}`,
          },
        });
      } else {
        request = request.clone({
          setHeaders: {
            ...headers
          },
        });
      }
    }
    return next.handle(request);
  }
}
