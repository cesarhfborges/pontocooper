import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, Observable} from 'rxjs';
import {environment} from '../../../environments/environment';
import {map} from 'rxjs/operators';
import {addMinutes, formatISO, parseISO} from 'date-fns';
import {Usuario} from '../models/usuario';
import {Router} from '@angular/router';

interface IAuth {
  access: string;
  expire: string;
  refresh: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private auth = new BehaviorSubject<IAuth>(undefined);

  constructor(
    private http: HttpClient,
    private router: Router,
  ) {
    const l: any = localStorage.getItem('contents');
    if (l) {
      this.auth.next(JSON.parse(atob(l)));
    }
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
          this.setAuth(response);
          return true;
        }
        return false;
      }));
  }

  refreshToken(refreshToken: string): Observable<boolean> {
    return this.http.post<any>(`${environment.apiUrl}/auth/refresh/`, {refresh: refreshToken}).pipe(map(response => {
      if (response.access) {
        this.updateTokenAuth(response.access);
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

  setAuth(auth: any): void {
    const l: IAuth = {
      ...auth,
      expire: formatISO(addMinutes(new Date(), 2))
    };
    localStorage.setItem('contents', btoa(JSON.stringify(l)));
    localStorage.setItem('content_DEV', JSON.stringify(l));
    this.auth.next(l);
  }

  getAuth(): Observable<IAuth> {
    return this.auth.asObservable();
  }

  updateTokenAuth(newToken: string): void {
    const l = JSON.parse(atob(localStorage.getItem('contents')));
    l.access = newToken;
    l.expire = formatISO(addMinutes(new Date(), 2));
    localStorage.setItem('contents', btoa(JSON.stringify(l)));
    localStorage.setItem('content_DEV', JSON.stringify(l));
  }
}
