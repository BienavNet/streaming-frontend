import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderRegisterForm } from './order-register-form';

describe('OrderRegisterForm', () => {
  let component: OrderRegisterForm;
  let fixture: ComponentFixture<OrderRegisterForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrderRegisterForm],
    }).compileComponents();

    fixture = TestBed.createComponent(OrderRegisterForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
