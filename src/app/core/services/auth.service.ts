import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {delay, map, Observable, tap} from 'rxjs';
import {Usuario} from '../models/usuario';
import {SessionService} from '../state/session.service';
import {Router} from '@angular/router';
import {environment} from '../../../environments/environment';

interface Credentials {
  username: string;
  password: string;
  remember?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private http: HttpClient,
    private session: SessionService,
    private router: Router,
  ) {
  }

  login(data: Credentials): Observable<boolean> {
    const credentials: Credentials = {
      username: data.username,
      password: data.password
    };
    return this.http.post<any>(`${environment.apiUrl}/auth`, credentials).pipe(
      tap((response: any) => {
        if (response?.access) {
          this.session.credentials = {
            access: response.access,
            refresh: response.refresh
          };
        }
      }),
      delay(350),
      map(response => !!response?.access && !!response.refresh)
    );
  }

  logout(): void {
    this.session.clear();
    this.router.navigate(['/login']).then();
    // window.location.reload();
  }

  perfil(): Observable<Usuario> {
    return this.http.get<Usuario>(`${environment.apiUrl}/person/current`);
  }

  refreshToken(): Observable<any> {
    const data: any = {
      refresh: `${this.session?.credentials?.refresh}`
    };
    return this.http.post<any>(`${environment.apiUrl}/auth/refresh/`, data).pipe(
      tap((response: any) => {
        if (response?.access !== undefined) {
          this.session.credentials = {
            refresh: this.session.credentials.refresh,
            access: response.access
          };
        }
      }),
      // delay(350),
      // map(response => !!response.access)
    );
  }
}
