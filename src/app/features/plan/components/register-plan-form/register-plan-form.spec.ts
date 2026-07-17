import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterPlanForm } from './register-plan-form';

describe('RegisterPlanForm', () => {
  let component: RegisterPlanForm;
  let fixture: ComponentFixture<RegisterPlanForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisterPlanForm],
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterPlanForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
