import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AmbassadorSignUpComponent } from './ambassador-sign-up.component';

describe('AmbassadorSignUpComponent', () => {
  let component: AmbassadorSignUpComponent;
  let fixture: ComponentFixture<AmbassadorSignUpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AmbassadorSignUpComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AmbassadorSignUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
