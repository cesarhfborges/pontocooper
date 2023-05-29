import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';
import { Options } from '../models';

@Injectable({
  providedIn: 'root',
})
export class OptionsService {

  private optionsKey: string = btoa('user-options');

  constructor() {
  }

  async savePreferences(options: Options) {
    console.log('saving preferences: ', options);
    const coded = this.encode(options);
    await Preferences.set({
      key: this.optionsKey,
      value: coded,
    });
  }

  async loadPreferences(): Promise<Options | null> {
    const {value} = await Preferences.get({key: this.optionsKey});
    const decoded = this.decode(value);
    return Promise.resolve(decoded);
  }

  async clear(): Promise<void> {
    await Preferences.remove({key: this.optionsKey});
  }

  private encode(data: Options) {
    const str: string = JSON.stringify(data);
    const enc: string = btoa(str);
    return enc;
  }

  private decode(data: string | null): Options | null {
    if (data !== null) {
      const dec: string = atob(data);
      return JSON.parse(dec);
    }
    return null;
  }
}
