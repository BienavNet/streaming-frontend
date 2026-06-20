import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlatformRegisterForm } from './platform-register-form';

describe('PlatformRegisterForm', () => {
  let component: PlatformRegisterForm;
  let fixture: ComponentFixture<PlatformRegisterForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlatformRegisterForm],
    }).compileComponents();

    fixture = TestBed.createComponent(PlatformRegisterForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
