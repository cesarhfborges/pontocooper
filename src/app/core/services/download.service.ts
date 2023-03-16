import {Injectable} from '@angular/core';
import {FileTransfer, FileTransferObject} from '@awesome-cordova-plugins/file-transfer/ngx';
import {File} from '@awesome-cordova-plugins/file/ngx';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DownloadService {

  constructor(
    private transfer: FileTransfer,
    private fileObject: FileTransferObject,
    private http: HttpClient,
    private file: File
  ) {
  }

  getAppVersion(): Observable<any> {
    return this.http.get<any>(
      'https://raw.githubusercontent.com/cesarhfborges/pontocooper/master/package.json'
    );
  }

  download() {
    const url = 'https://github.com/cesarhfborges/pontocooper/raw/master/apk/portal-coopersystem.apk';
    const request: FileTransferObject = this.transfer.create();
    return request.download(url, this.file.dataDirectory + '/portal-coopersystem.apk', true, {withCredentials: true});
  }
}
