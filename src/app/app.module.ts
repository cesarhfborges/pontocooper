import {APP_INITIALIZER, LOCALE_ID, NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
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
import {appInitializer} from './core/functions/app-initializer';
import {registerLocaleData} from '@angular/common';
import ptBr from '@angular/common/locales/pt';
import {ScreenOrientation} from '@ionic-native/screen-orientation/ngx';

registerLocaleData(ptBr);

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    FormsModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    RouterModule,
  ],
  providers: [
    ThemeDetection,
    StatusBar,
    Geolocation,
    ScreenOrientation,
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
    if (localStorage.getItem('opcoes') === null) {
      localStorage.setItem('opcoes', JSON.stringify({darkMode: 'automatico', loginRemember: false}));
    }
  }
}
