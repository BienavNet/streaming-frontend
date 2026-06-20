import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountRegisterForm } from './account-register-form';

describe('AccountRegisterForm', () => {
  let component: AccountRegisterForm;
  let fixture: ComponentFixture<AccountRegisterForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccountRegisterForm],
    }).compileComponents();

    fixture = TestBed.createComponent(AccountRegisterForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
