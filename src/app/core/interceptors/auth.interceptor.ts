import {Injectable} from '@angular/core';
import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {ActivatedRoute, Router} from '@angular/router';
import {SessionService} from '../state/session.service';
import {AuthService} from '../services/auth.service';
import {flatMap, Observable, switchMap, tap, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthInterceptor implements HttpInterceptor {

  constructor(
    private session: SessionService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
  ) {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError(err => {
        console.warn('Efetuando refresh token, aguarde...');
        if (err instanceof HttpErrorResponse) {
          if ([401].includes(err.status)) {
            if (this.session.isLoggedIn() && this.session.credentials !== null) {
              console.log('Estou logado e farei o refresh');
              return this.authService.refreshToken().pipe(
                flatMap(() => {
                  const customHeaders: any = request.headers.set('Authorization', `Bearer ${this.session?.credentials?.access}`);
                  const req: HttpRequest<any> = request.clone({withCredentials: true, headers: customHeaders});
                  console.log('request data: ', req);
                  return next.handle(req);
                }),
                catchError(() => throwError({...err.error}))
              );
            }
          }
        }
        return throwError({...err.error});
      })
    );
  }
}
