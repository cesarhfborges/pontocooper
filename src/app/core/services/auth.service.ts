import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {map, Observable} from 'rxjs';
import {Router} from '@angular/router';
import {environment} from 'src/environments/environment';

interface IAuth {
  access: string;
  expire: string;
  refresh: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private keyName = 'suyJN1guijg/9avvjE1ctw==';

  constructor(
    private http: HttpClient,
    private router: Router,
  ) {
  }

  login(data: { email: string; password: string }): Observable<boolean> {
    return this.http.post<any>(`${environment.apiUrl}/auth`, data).pipe(
      map(response => {
        if (response.access) {
          // this.setAuth(response).catch();
          return true;
        }
        return false;
      })
    );
  }
}
