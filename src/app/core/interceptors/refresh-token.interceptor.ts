import {Injectable} from '@angular/core';
import {HttpErrorResponse, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {ActivatedRoute, Router} from '@angular/router';
import {SessionService} from '../state/session.service';
import {AuthService} from '../services/auth.service';
import {BehaviorSubject, filter, finalize, Observable, switchMap, throwError,} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {LoadingController, ToastController} from '@ionic/angular';
import {Color} from '@ionic/core';
import {Location} from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class RefreshTokenInterceptor implements HttpInterceptor {

  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  constructor(
    private session: SessionService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
    private toastController: ToastController,
    private loadingController: LoadingController,
    private location: Location
  ) {
  }

  // intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
  //   return next.handle(request).pipe(
  //     delayWhen(() => this.refreshing ? timer(900) : timer(0)),
  //     catchError(err => {
  //       if (err instanceof HttpErrorResponse) {
  //         if ([401].includes(err.status)) {
  //           if (this.session.credentials !== null && !this.refreshing) {
  //             this.refreshing = true;
  //             this.showLoading('Aguarde...');
  //             return this.authService.refreshToken().pipe(
  //               flatMap(() => {
  //                 const customHeaders: any = request.headers.set('Authorization', `Bearer ${this.session?.credentials?.access}`);
  //                 const req: HttpRequest<any> = request.clone({withCredentials: true, headers: customHeaders});
  //                 this.refreshing = false;
  //                 return next.handle(req);
  //               }),
  //               catchError(() => {
  //                 this.showToast('Ooops, Usuário não autenticado, efetue login novamente', 'danger');
  //                 this.refreshing = false;
  //                 this.authService.logout();
  //                 return throwError({...err.error});
  //               })
  //             );
  //           }
  //         }
  //       }
  //       return throwError({...err.error});
  //     })
  //   );
  // }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<any> {
    const token = this.session.credentials.access;
    const isApiRequest = request.url.startsWith(this.location.prepareExternalUrl('/api'));

    if (token && isApiRequest) {
      request = this.addTokenToRequest(request, token);
    }
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401 && isApiRequest) {
          if (!this.isRefreshing) {
            this.isRefreshing = true;
            this.refreshTokenSubject.next(null);
            this.showLoading('Aguarde...');
            return this.authService.refreshToken().pipe(
              switchMap((response: any) => {
                const newToken = response.access;
                this.isRefreshing = false;
                this.refreshTokenSubject.next(newToken);
                // this.refreshTokenSubject.complete();
                return next.handle(this.addTokenToRequest(request, newToken));
              }),
              catchError((e: any) => {
                this.showToast('Ooops, Usuário não autenticado, efetue login novamente', 'danger');
                this.authService.logout();
                return throwError(e);
              })
            );
          } else {
            const isRefreshTokenRequest = request.url.startsWith(this.location.prepareExternalUrl('/api/v1/auth/refresh/'));
            if (!isRefreshTokenRequest) {
              return this.refreshTokenSubject.pipe(
                filter((refToken) => refToken !== null),
                switchMap((refToken) => next.handle(this.addTokenToRequest(request, refToken))),
              );
            }
          }
        }
        return throwError(error);
      })
    );
  }

  private addTokenToRequest(request: HttpRequest<any>, token: string): HttpRequest<any> {
    return request.clone({
      setHeaders: {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        Authorization: `Bearer ${token}`
      }
    });
  }

  private showLoading(message: string, duration: number = 2500): void {
    const loadingExec = (async () => {
      const loading = await this.loadingController.create({
        message,
        duration,
        backdropDismiss: false,
        keyboardClose: false,
        showBackdrop: true,
        animated: true,
        spinner: 'bubbles',
        cssClass: 'my-custom-class'
      });
      await loading.present();
    });
    loadingExec().catch();
  }

  private showToast(message: string, color: Color = 'danger', duration: number = 3500): void {
    this.toastController.create({
      message,
      duration,
      color,
      position: 'bottom',
    }).then((toast) => {
      toast.present().catch();
    });
  }
}
