import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs';
import {AuthService} from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class JwtInterceptor implements HttpInterceptor {

  constructor(
    private authService: AuthService,
  ) {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    // if (this.authService.isAuthenticated() && request.url !== 'https://api.portal.coopersystem.com.br/api/v1/auth/refresh/') {
    //   this.authService.refresh().subscribe(
    //     response => {
    //       const r = response;
    //     },
    //     error => {
    //       console.log(error);
    //     }
    //   );
    // }
    const headers: any = {
      // eslint-disable-next-line
      'Content-Type': 'application/json',
      // eslint-disable-next-line
      'X-Requested-With': 'XMLHttpRequest',
    };

    if (localStorage.getItem('contents') !== null) {
      request = request.clone({
        setHeaders: {
          ...headers,
          authorization: `Bearer ${this.authService.getToken()}`,
        },
      });
    } else {
      request = request.clone({
        setHeaders: {
          ...headers
        },
      });
    }
    return next.handle(request);
  }
}
