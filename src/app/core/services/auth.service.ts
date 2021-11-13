import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';
import {map} from 'rxjs/operators';
import {addMinutes, formatISO, parseISO} from 'date-fns';
import {Usuario} from '../models/usuario';
import {Router} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private http: HttpClient,
    private router: Router,
  ) {
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('contents');
  }

  logout(): void {
    localStorage.removeItem('contents');
    window.location.reload();
    this.router.navigate(['/login']).then();
  }

  getToken(): string {
    return JSON.parse(atob(localStorage.getItem('contents'))).access;
  }

  login(data: { email: string; password: string }): Observable<boolean> {
    return this.http.post<any>(`${environment.apiUrl}/auth`, data)
      .pipe(map(response => {
        if (response.access) {
          const l = {...response, expire: formatISO(addMinutes(new Date(), 2))};
          localStorage.setItem('contents', btoa(JSON.stringify(l)));
          localStorage.setItem('content_DEV', JSON.stringify(l));
          return true;
        }
        return false;
      }));
  }

  refreshToken(refreshToken: string): Observable<boolean> {
    return this.http.post<any>(`${environment.apiUrl}/auth/refresh/`, {refresh: refreshToken}).pipe(map(response => {
      if (response.access) {
        const l = JSON.parse(atob(localStorage.getItem('contents')));
        l.access = response.access;
        l.expire = formatISO(addMinutes(new Date(), 2));
        localStorage.setItem('contents', btoa(JSON.stringify(l)));
        localStorage.setItem('content_DEV', JSON.stringify(l));
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

  tokenExpired(): boolean {
    const l: any = localStorage.getItem('contents');
    if (l) {
      const expireDate: Date = parseISO(JSON.parse(atob(l)).expire);
      console.log('agora: ', new Date());
      console.log('expire: ', expireDate);
      console.log('expired: ', new Date() > expireDate);
      return new Date() > expireDate;
    }
    return false;
  }

  perfil(): Observable<Usuario> {
    return this.http.get<Usuario>(`${environment.apiUrl}/person/current`);
  }

  solicitarRetificacao(data: any): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/rectification_request/`, data);
  }
}
