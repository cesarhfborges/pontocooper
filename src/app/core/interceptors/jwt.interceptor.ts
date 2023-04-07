import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs';
import {AuthService} from '../services/auth.service';
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
    let customHeaders: HttpHeaders = new HttpHeaders();
    customHeaders = customHeaders.set('Content-Type', 'application/json').set('X-Requested-With', 'XMLHttpRequest');
    if (this.session.isAuthenticated()) {
      customHeaders = customHeaders.set('authorization', this.session.authentication.access);
    }
    const req = request.clone({withCredentials: true, headers: customHeaders});
    return next.handle(req);
  }
}

// import { HttpInterceptorFn } from '@angular/common/http';
// import { tap } from 'rxjs';
//
// export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
//
//   console.log('request', req.method, req.url);
//   console.log('authInterceptor');
//
//   if (req.url.startsWith('http://localhost:4200/api')) {
//     // Setting a dummy token for demonstration
//     const headers = req.headers.set('Authorization', 'Bearer Auth-1234567');
//     req = req.clone({
//       headers
//     });
//
//   }
//   return next(req).pipe(
//     tap(resp => console.log('response', resp))
//   );
//
// };
