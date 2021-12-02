import {Subject, Subscription} from 'rxjs';
import {BackButtonEventDetail} from '@ionic/core';

export interface BackButtonEmitter extends Subject<BackButtonEventDetail> {
  subscribeWithPriority(priority: number, callback: (processNextHandler: () => void) => Promise<any> | void): Subscription;
}

export default class MockPlatform {

  backButton: BackButtonEmitter;
  keyboardDidShow: any;
  keyboardDidHide: Subject<void>;
  pause: Subject<void>;
  resume: Subject<void>;
  resize: Subject<void>;
  readonly isRTL: boolean;
  private doc;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  private _readyPromise;
  private win;

  constructor() {
  }

  ready(): Promise<void> {
    return Promise.resolve();
  }

  is(type: string): Promise<any> {
    return Promise.resolve();
  }

  platforms() {
  }
}
