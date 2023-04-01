import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthService} from '../services/auth.service';
import {Observable, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthInterceptor implements HttpInterceptor {

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
  ) {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError(err => {
        if (!['/login', '/cadastro', '/recuperarsenha'].includes(this.router.url) && [401].includes(err.status)) {
          // this.authService.auth().then(auth => {
          //   if (auth !== undefined && auth !== null) {
          //     // this.authService.refreshToken(token).toPromise().catch(() => {
          //     //   this.authService.logout(); // auto logout if 401 response returned from api backend
          //     // });
          //   }
          // });
        }
        return throwError({...err.error});
      })
    );
  }
}
