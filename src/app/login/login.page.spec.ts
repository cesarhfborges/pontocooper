import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {IonicModule} from '@ionic/angular';
import {RouterTestingModule} from '@angular/router/testing';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {SharedModule} from '../shared/shared.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {LoginPage} from './login.page';
import {AuthService} from '../core/services/auth.service';
import {Observable, of, throwError} from 'rxjs';

class MockAuthService {
  login(data: any): Observable<any> {
    return of({
      access: 'teste de acess code',
      refresh: 'teste de refresh token',
    });
  }
}


describe('LoginPage', () => {
  let component: LoginPage;
  let fixture: ComponentFixture<LoginPage>;
  let service: AuthService;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [LoginPage],
      imports: [
        IonicModule.forRoot(),
        RouterTestingModule,
        HttpClientTestingModule,
        SharedModule,
        ReactiveFormsModule,
        FormsModule,
      ],
      providers: [
        {provide: AuthService, useClass: MockAuthService}
      ]
    });
    TestBed.compileComponents().catch();

    fixture = TestBed.createComponent(LoginPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('deve testar o login com sucesso.', () => {
    const btns: any[] = fixture.debugElement.nativeElement.getElementsByTagName('ion-button');
    btns[0].click();

    expect(component).toBeTruthy();
  });

  it('deve testar o login com erro.', () => {
    spyOn(service, 'login').and.returnValue(throwError('error'));

    const btns: any[] = fixture.debugElement.nativeElement.getElementsByTagName('ion-button');
    btns[0].click();
    expect(component).toBeTruthy();
  });
});
