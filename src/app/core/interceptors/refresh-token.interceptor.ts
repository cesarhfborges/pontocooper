import { Injectable } from '@angular/core';
import { HttpErrorResponse, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { SessionService } from '../state/session.service';
import { AuthService } from '../services/auth.service';
import { BehaviorSubject, catchError, filter, finalize, Observable, switchMap, throwError } from 'rxjs';
import { LoadingController, ToastController } from '@ionic/angular';
import { Color } from '@ionic/core';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
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
  ) {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<any> {
    const token = this.session.credentials.access;
    const isApiRequest = request.url.startsWith(environment.apiUrl);

    if (token && isApiRequest) {
      request = this.addTokenToRequest(request, token);
    }
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        const isRefreshTokenRequest = request.url.startsWith(`${environment.apiUrl}/auth/refresh/`);
        if (error.status === 401 && isApiRequest && !isRefreshTokenRequest) {
          if (!this.isRefreshing) {
            this.isRefreshing = true;
            this.refreshTokenSubject.next(null);
            this.showLoading('Aguarde...');
            return this.authService.refreshToken().pipe(
              switchMap((response: any) => {
                const newToken = response.access;
                this.refreshTokenSubject.next(newToken);
                this.isRefreshing = false;
                this.refreshTokenSubject.complete();
                return next.handle(this.addTokenToRequest(request, newToken));
              }),
              catchError((e: any) => {
                this.showToast('Ooops, Usuário não autenticado, efetue login novamente', 'danger');
                this.authService.logout();
                return throwError(e);
              }),
            );
          } else {
            return this.refreshTokenSubject.pipe(
              filter((refToken) => refToken !== null),
              switchMap((refToken) => next.handle(this.addTokenToRequest(request, refToken))),
            );
          }
        }
        return throwError(() => error);
      }),
      finalize(() => {
      }),
    );
  }

  private addTokenToRequest(request: HttpRequest<any>, token: string): HttpRequest<any> {
    return request.clone({
      setHeaders: {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        Authorization: `Bearer ${token}`,
      },
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
        cssClass: 'my-custom-class',
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
