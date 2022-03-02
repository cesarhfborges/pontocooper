import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AusenciasHorasExtrasPage } from './ausencias-horas-extras.page';

describe('AusenciasHorasExtrasPage', () => {
  let component: AusenciasHorasExtrasPage;
  let fixture: ComponentFixture<AusenciasHorasExtrasPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AusenciasHorasExtrasPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AusenciasHorasExtrasPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
