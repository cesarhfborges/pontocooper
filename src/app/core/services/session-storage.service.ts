import {Injectable} from '@angular/core';
import {Auth} from '../interfaces/auth';
import {environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SessionStorageService {
  private user_key = 'suyJN1guijg/9avvjE1ctw==';
  private credentials: Auth | undefined = undefined;

  constructor() {
    this.load();
  }

  get authentication(): Auth {
    if (this.credentials) {
      return this.credentials;
    }
    return {access: '', expire: '', refresh: ''};
  }

  // set authentication(value: Auth | undefined) {
  //   this.credentials = value;
  // }

  public isAuthenticated(): boolean {
    return this.credentials !== undefined;
  }

  public clear(): void {
    this.credentials = undefined;
    window.localStorage.clear();
  }

  store(data: Auth) {
    try {
      const stringfied: string = JSON.stringify(data);
      const encripted: string = btoa(stringfied);
      window.localStorage.setItem(this.user_key, encripted);
      this.credentials = data;
      if (!environment.production) {
        window.localStorage.setItem('development', JSON.stringify(data));
      }
    } catch (e) {
      throw new Error('Não foi possível realizar o store das credenciais.');
    }
  }

  private load(): void {
    const storage: any = window.localStorage.getItem(this.user_key);
    if (!storage) {
      this.credentials = undefined;
    } else {
      const auth: string = atob(storage);
      this.credentials = JSON.parse(auth);
    }
  }
}
