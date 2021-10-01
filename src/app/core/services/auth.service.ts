import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';
import {map} from 'rxjs/operators';
import {addMinutes} from 'date-fns';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private http: HttpClient,
  ) {
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('contents');
  }

  logout(): void {
    localStorage.removeItem('contents');
    localStorage.removeItem('contents_backup');
    window.location.reload();
  }

  getToken(): string {
    return JSON.parse(atob(localStorage.getItem('contents'))).access;
  }

  login(data: { email: string; password: string }): Observable<boolean> {
    return this.http.post<any>(`${environment.apiUrl}/auth`, data)
      .pipe(map(response => {
        if (response.access) {
          const l = {...response, expire: addMinutes(new Date(), 2)};
          localStorage.setItem('contents', btoa(JSON.stringify(l)));
          if (!environment.production) {
            localStorage.setItem('contents_backup', JSON.stringify(l));
          }
          return true;
        }
        return false;
      }));
  }

  refresh(): Observable<boolean> {
    return this.http.post<any>(`${environment.apiUrl}/auth/refresh/`, {refresh: this.getRefreshToken()})
      .pipe(map(response => {
        if (response.access) {
          const l = JSON.parse(atob(localStorage.getItem('contents')));
          l.access = response.access;
          localStorage.setItem('contents', btoa(JSON.stringify(l)));
          if (!environment.production) {
            localStorage.setItem('contents_backup', JSON.stringify(l));
          }
          return true;
        }
        return false;
      }));
  }

  private getRefreshToken(): string {
    return JSON.parse(atob(localStorage.getItem('contents'))).refresh;
  }
}
