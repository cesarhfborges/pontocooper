import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';
import {map} from 'rxjs/operators';
import {addMinutes} from 'date-fns';
import {Usuario} from '../../shared/models/usuario';

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
          return true;
        }
        return false;
      }));
  }

  refreshToken(refreshToken: string): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/auth/refresh/`, {refresh: refreshToken}).pipe(map(response => {
      if (response.access) {
        const l = JSON.parse(atob(localStorage.getItem('contents')));
        l.access = response.access;
        localStorage.setItem('contents', btoa(JSON.stringify(l)));
        return true;
      }
      return false;
    }));
  }

  getRefreshToken(): string {
    const r: any = localStorage.getItem('contents');
    if (r) {
      return JSON.parse(atob(r)).refresh;
    }
    return null;
  }

  perfil(): Observable<Usuario> {
    return this.http.get<Usuario>(`${environment.apiUrl}/person/current`);
  }
}
