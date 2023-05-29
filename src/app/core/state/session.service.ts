import {Injectable} from '@angular/core';
import {Auth} from '../models/auth';

@Injectable({
  providedIn: 'root'
})
export class SessionService {

  private storeKey: string = btoa('coopersystem');

  private auth: Auth | null = null;

  constructor() {
    this.auth = this.load();
  }

  get credentials(): Auth {
    if (this.auth !== null) {
      return this.auth;
    }
    return {access: '', refresh: ''};
  }

  set credentials(data: Auth) {
    const str: string = JSON.stringify(data);
    const enc: string = btoa(str);
    window.sessionStorage.setItem(this.storeKey, enc);
    this.auth = data;
  }

  public isLoggedIn(): boolean {
    return !!window.sessionStorage.getItem(this.storeKey);
  }

  public clear(): void {
    this.auth = null;
    window.sessionStorage.removeItem(this.storeKey);
  }

  private load(): Auth | null {
    const data: any = window.sessionStorage.getItem(this.storeKey);
    if (data !== null) {
      const dec: string = atob(data);
      return JSON.parse(dec);
    }
    return null;
  }
}
