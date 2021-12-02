import {ComponentFixture, TestBed} from '@angular/core/testing';
import {IonicModule, IonRouterOutlet, MenuController, Platform} from '@ionic/angular';

import {HomePage} from './home.page';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {FormBuilder, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RouterTestingModule} from '@angular/router/testing';
import {StatusBar} from '@ionic-native/status-bar/ngx';
import {ThemeDetection} from '@ionic-native/theme-detection/ngx';
import {Geolocation} from '@ionic-native/geolocation/ngx';
import {ScreenOrientation} from '@ionic-native/screen-orientation/ngx';
import MockThemeDetection from '../shared/mockTesting/MockThemeDetection';
import MockPlatform from '../shared/mockTesting/MockPlatform';
import MockMenuController from '../shared/mockTesting/MockMenuController';
import {Ponto} from '../core/models/ponto';
import MockGeolocation from '../shared/mockTesting/MockGeolocation';
import MockStatusBar from '../shared/mockTesting/MockStatusBar';
import MockScreenOrientation from '../shared/mockTesting/MockScreenOrientation';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

fdescribe('HomePage', () => {
  let component: HomePage;
  let fixture: ComponentFixture<HomePage>;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      declarations: [HomePage],
      imports: [
        IonicModule.forRoot(),
        FormsModule,
        BrowserAnimationsModule,
        ReactiveFormsModule,
        HttpClientTestingModule,
        RouterTestingModule.withRoutes([
          {path: 'home', loadChildren: () => import('../home/home.module').then(m => m.HomePageModule)}
        ])
      ],
      providers: [
        FormBuilder,
        Platform,
        IonRouterOutlet,
        {provide: ScreenOrientation, useClass: MockScreenOrientation},
        {provide: StatusBar, useClass: MockStatusBar},
        {provide: Geolocation, useClass: MockGeolocation},
        {provide: ThemeDetection, useClass: MockThemeDetection},
        {provide: MenuController, useClass: MockMenuController},
      ]
    });
    await TestBed.compileComponents();

    fixture = TestBed.createComponent(HomePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  beforeEach(() => {
    const batidas: Array<Date> = [];
    component.ponto = new Ponto(batidas);
  });

  fit('should create', () => {
    component.ngAfterViewInit();
    expect(component).toBeTruthy();
  });
});
