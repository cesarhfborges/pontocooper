import {Injectable} from '@angular/core';
import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {ActivatedRoute, Router} from '@angular/router';
import {SessionService} from '../state/session.service';
import {AuthService} from '../services/auth.service';
import {delayWhen, filter, flatMap, map, Observable, switchAll, switchMap, throwError, timer,} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {LoadingController, ToastController} from '@ionic/angular';
import {Color} from '@ionic/core';

@Injectable({
  providedIn: 'root'
})
export class AuthInterceptor implements HttpInterceptor {

  private refreshing = false;

  constructor(
    private session: SessionService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
    private toastController: ToastController,
    private loadingController: LoadingController
  ) {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      delayWhen(() => this.refreshing ? timer(900) : timer(0)),
      catchError(err => {
        if (err instanceof HttpErrorResponse) {
          if ([401].includes(err.status)) {
            if (this.session.credentials !== null && !this.refreshing) {
              this.refreshing = true;
              this.showLoading('Aguarde...');
              return this.authService.refreshToken().pipe(
                flatMap(() => {
                  const customHeaders: any = request.headers.set('Authorization', `Bearer ${this.session?.credentials?.access}`);
                  const req: HttpRequest<any> = request.clone({withCredentials: true, headers: customHeaders});
                  this.refreshing = false;
                  return next.handle(req);
                }),
                catchError(() => {
                  this.showToast('Ooops, Usuário não autenticado, efetue login novamente', 'danger');
                  this.refreshing = false;
                  this.authService.logout();
                  return throwError({...err.error});
                })
              );
            }
          }
        }
        return throwError({...err.error});
      })
    );
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
