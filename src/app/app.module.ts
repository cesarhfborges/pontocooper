import {APP_INITIALIZER, LOCALE_ID, NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {RouteReuseStrategy, RouterModule} from '@angular/router';
import {IonicModule, IonicRouteStrategy, LoadingController} from '@ionic/angular';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {AppComponent} from './app.component';
import {AppRoutingModule} from './app-routing.module';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {JwtInterceptor} from './core/interceptors/jwt.interceptor';
import {AuthInterceptor} from './core/interceptors/auth.interceptor';
import {ThemeDetection} from '@ionic-native/theme-detection/ngx';
import {StatusBar} from '@ionic-native/status-bar/ngx';
import {Geolocation} from '@ionic-native/geolocation/ngx';
import {AuthService} from './core/services/auth.service';
import {ScreenOrientation} from '@ionic-native/screen-orientation/ngx';
import {LocalNotifications} from '@ionic-native/local-notifications/ngx';
import {Device} from '@ionic-native/device/ngx';
import {Badge} from '@ionic-native/badge/ngx';
import {SharedModule} from './shared/shared.module';
import {BackgroundMode} from '@awesome-cordova-plugins/background-mode/ngx';
import {NgxDatatableModule} from '@swimlane/ngx-datatable';
import {FileTransfer, FileTransferObject} from '@awesome-cordova-plugins/file-transfer/ngx';
import {FileOpener} from '@awesome-cordova-plugins/file-opener/ngx';
import {File} from '@awesome-cordova-plugins/file/ngx';

import {appInitializer} from './core/functions/app-initializer';
import {registerLocaleData} from '@angular/common';
import ptBr from '@angular/common/locales/pt';

registerLocaleData(ptBr);

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    RouterModule,
    SharedModule,
    NgxDatatableModule
  ],
  providers: [
    ThemeDetection,
    StatusBar,
    Geolocation,
    ScreenOrientation,
    LocalNotifications,
    Badge,
    Device,
    BackgroundMode,
    FileTransfer,
    FileTransferObject,
    File,
    FileOpener,
    {provide: LOCALE_ID, useValue: 'pt-BR'},
    {
      provide: APP_INITIALIZER,
      useFactory: appInitializer,
      multi: true,
      deps: [AuthService, LoadingController]
    },
    {provide: RouteReuseStrategy, useClass: IonicRouteStrategy},
    {provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true},
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
  constructor() {
    if (localStorage.getItem('opcoes') === null || localStorage.getItem('opcoes') === undefined) {
      const opts: any = {
        darkMode: 'automatico',
        loginRemember: true,
        valorAcumulado: false,
        intervalo: 30
      };
      localStorage.setItem('opcoes', JSON.stringify(opts));
    }
  }
}
