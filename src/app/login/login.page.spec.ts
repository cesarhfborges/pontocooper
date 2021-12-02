import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {IonicModule, MenuController, Platform} from '@ionic/angular';

import {LoginPage} from './login.page';
import {FormBuilder, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {RouterTestingModule} from '@angular/router/testing';
import {StatusBar} from '@ionic-native/status-bar/ngx';
import {ThemeDetection} from '@ionic-native/theme-detection/ngx';
import MockThemeDetection from '../shared/mockTesting/MockThemeDetection';
import MockPlatform from '../shared/mockTesting/MockPlatform';
import MockMenuController from '../shared/mockTesting/MockMenuController';
import {AuthService} from '../core/services/auth.service';
import {of, throwError} from 'rxjs';

describe('LoginPage', () => {
  let component: LoginPage;
  let fixture: ComponentFixture<LoginPage>;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      declarations: [LoginPage],
      imports: [
        IonicModule.forRoot(),
        FormsModule,
        ReactiveFormsModule,
        HttpClientTestingModule,
        RouterTestingModule.withRoutes([
          {path: 'home', loadChildren: () => import('../home/home.module').then(m => m.HomePageModule)}
        ])
      ],
      providers: [
        FormBuilder,
        StatusBar,
        {provide: ThemeDetection, useClass: MockThemeDetection},
        {provide: Platform, useClass: MockPlatform},
        {provide: MenuController, useClass: MockMenuController},
      ]
    });
    await TestBed.compileComponents();

    fixture = TestBed.createComponent(LoginPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    component.ionViewDidEnter();
    expect(component).toBeTruthy();
  });

  it('espera que menu Controls seja executado e resolvido', async () => {
    await expectAsync(component.menuControl(true)).toBeResolved();
  });

  it('Espera que submit seja executado (SUCCESS)', () => {
    const service = TestBed.inject(AuthService);
    const response: any = {
      token: '123456789'
    };
    spyOn(service, 'login').and.callFake(() => of(response));
    component.form.patchValue({
      username: 'usuario',
      password: '123456',
      remember: true,
    });
    component.onSubmit();
    expect(component).toBeTruthy();
  });

  it('Espera que submit seja executado (ERROR)', () => {
    const service = TestBed.inject(AuthService);
    spyOn(service, 'login').and.callFake(() => throwError({status: 500}));
    component.form.patchValue({
      username: 'usuario',
      password: '123456',
      remember: true,
    });
    component.onSubmit();
    expect(component).toBeTruthy();
  });
});
