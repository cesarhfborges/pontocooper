import { PreventFocusDirective } from './prevent-focus.directive';
import {Component, DebugElement} from "@angular/core";
import {ComponentFixture, TestBed} from "@angular/core/testing";
import {By} from "@angular/platform-browser";

@Component({
  template: `
    <div appPreventFocus>
      <input>
      <button>Button 2</button>
    </div>
  `
})
class TestComponent {}

describe('PreventFocusDirective', () => {

  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;
  let divElement: DebugElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TestComponent, PreventFocusDirective]
    });

    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
    divElement = fixture.debugElement.query(By.directive(PreventFocusDirective));
  });

  it('should prevent focus and blur child elements on click', () => {
    const buttonElements = divElement.queryAll(By.css('button'));

    spyOn(buttonElements[0].nativeElement, 'blur');
    spyOn(buttonElements[1].nativeElement, 'blur');

    buttonElements[0].triggerEventHandler('click', null);

    expect(buttonElements[0].nativeElement.blur).toHaveBeenCalled();
    expect(buttonElements[1].nativeElement.blur).toHaveBeenCalled();
  });

  it('should prevent default and stop immediate propagation on click', () => {
    const clickEvent = new MouseEvent('click', { bubbles: true });

    spyOn(clickEvent, 'preventDefault');
    spyOn(clickEvent, 'stopImmediatePropagation');

    divElement.nativeElement.dispatchEvent(clickEvent);

    expect(clickEvent.preventDefault).toHaveBeenCalled();
    expect(clickEvent.stopImmediatePropagation).toHaveBeenCalled();
  });

  // it('should create an instance', () => {
  //   const el = new HTMLElement();
  //   const directive = new PreventFocusDirective();
  //   expect(directive).toBeTruthy();
  // });
});
