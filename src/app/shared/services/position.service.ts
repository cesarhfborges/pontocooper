import {Injectable} from '@angular/core';
import {Geolocation} from '@capacitor/geolocation';
import {GeolocationPluginPermissions, PermissionStatus, Position} from '@capacitor/geolocation/dist/esm/definitions';
import {PermissionState} from '@capacitor/core';

@Injectable({
  providedIn: 'root'
})
export class PositionService {

  constructor() {
  }

  async checkPermissions(): Promise<PermissionStatus> {
    return await Geolocation.checkPermissions();
  }

  async requestPermissions(): Promise<boolean> {
    try {
      const permissions = await Geolocation.checkPermissions();
      const permissionsList: PermissionState[] = [
        'prompt',
        'prompt-with-rationale'
      ];
      if (permissionsList.includes(permissions.location) || permissionsList.includes(permissions.coarseLocation)) {
        const options: GeolocationPluginPermissions = {
          permissions: ['location', 'coarseLocation']
        };
        await Geolocation.requestPermissions(options);
        return true;
      }
      return false;
    } catch (e) {
      return false;
    }
  }

  async getCurrentPosition(): Promise<Position | undefined> {
    const permissions = await Geolocation.checkPermissions();
    if (permissions.location === 'granted' || permissions.coarseLocation === 'granted') {
      return await Geolocation.getCurrentPosition();
    }
    return undefined;
  }
}
