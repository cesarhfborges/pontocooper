import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {delay, map, Observable, tap} from 'rxjs';
import {SessionStorageService} from './session-storage.service';

interface IAuth {
  access: string;
  expire: string;
  refresh: string;
}

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
    private session: SessionStorageService
  ) {
  }

  login(data: Credentials): Observable<boolean> {
    const credentials: Credentials = {
      username: data.username,
      password: data.password
    };
    return this.http.post<any>(`/api/auth`, credentials).pipe(
      tap((response: any) => {
        if (response?.access) {
          this.session.store(response);
        }
      }),
      map(response => !!response?.access)
    );
  }
}
