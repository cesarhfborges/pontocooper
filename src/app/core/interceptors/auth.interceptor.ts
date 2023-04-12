import {Injectable} from '@angular/core';
import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {ActivatedRoute, Router} from '@angular/router';
import {SessionService} from '../state/session.service';
import {AuthService} from '../services/auth.service';
import {delay, delayWhen, flatMap, map, Observable, tap, throwError, timer} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {ToastController} from '@ionic/angular';
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
    private toastController: ToastController
  ) {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      delayWhen(() => this.refreshing ? timer(900) : timer(0)),
      catchError(err => {
        console.warn('Efetuando refresh token, aguarde...');
        if (err instanceof HttpErrorResponse) {
          if ([401].includes(err.status)) {
            if (this.session.credentials !== null && !this.refreshing) {
              console.log('Estou logado e farei o refresh');
              this.refreshing = true;
              return this.authService.refreshToken().pipe(
                flatMap(() => {
                  console.log(' ============================================== ');
                  console.log('cai no flat map Sucesso');
                  const customHeaders: any = request.headers.set('Authorization', `Bearer ${this.session?.credentials?.access}`);
                  const req: HttpRequest<any> = request.clone({withCredentials: true, headers: customHeaders});
                  console.log('request data: ', req);
                  this.refreshing = false;
                  return next.handle(req);
                }),
                catchError(() => {
                  console.log(' ============================================== ');
                  console.log('cai no catchError Não deu pra fazer refresh token');
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

  private showLoading(): void {

  }

  private showToast(text: string, status: Color = 'danger'): void {
    this.toastController.create({
      message: text,
      duration: 3500,
      position: 'bottom',
      color: status,
    }).then((toast) => {
      toast.present().catch();
    });
  }
}
