import {FileTransferObject} from '@awesome-cordova-plugins/file-transfer/ngx';
import {BehaviorSubject, Observable} from 'rxjs';
import {distinctUntilChanged} from 'rxjs/operators';

export class Update {
  public baixando = false;
  public status: 'baixando' | 'concluido' | 'error';
  private url = 'https://github.com/cesarhfborges/pontocooper/raw/master/apk/portal-coopersystem.apk';
  private fileTransfer: FileTransferObject;
  private percent$: BehaviorSubject<number>;
  private dataDirectory: string;

  constructor(fileTransfer: FileTransferObject, dataDirectory: string) {
    this.fileTransfer = fileTransfer;
    this.dataDirectory = dataDirectory;
    this.percent$ = new BehaviorSubject(0);
    this.fileTransfer.onProgress((event) => {
      this.status = 'baixando';
      const p = (event.loaded / event.total) * 100;
      this.setPorcentagem(p);
    });
  }

  porcentagem(): Observable<number> {
    return this.percent$.asObservable().pipe(distinctUntilChanged());
  }

  setPorcentagem(valor: number) {
    this.percent$.next(valor);
  }

  async download(): Promise<any> {
    return await new Promise<void>((resolve, reject) => {
      this.baixando = true;
      this.fileTransfer.download(
        this.url,
        this.dataDirectory + '/portal-coopersystem.apk',
        true,
        {withCredentials: true, cache: false}
      ).then(r => {
        this.baixando = false;
        this.status = 'concluido';
        resolve(r);
      }).catch(
        e => {
          this.baixando = false;
          this.status = 'error';
          reject();
        }
      );
    });
  }

  getStatusColor(): string {
    switch (this.status) {
      case 'concluido':
        return 'success';
      case 'baixando':
        return 'info';
      case 'error':
        return 'danger';
      default:
        return 'danger';
    }
  }
}
