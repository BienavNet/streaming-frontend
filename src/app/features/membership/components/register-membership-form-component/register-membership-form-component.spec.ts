import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterMembershipFormComponent } from './register-membership-form-component';

describe('RegisterMembershipFormComponent', () => {
  let component: RegisterMembershipFormComponent;
  let fixture: ComponentFixture<RegisterMembershipFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisterMembershipFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterMembershipFormComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
