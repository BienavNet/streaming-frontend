import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateMembershipComponent } from './update-membership-component';

describe('UpdateMembershipComponent', () => {
  let component: UpdateMembershipComponent;
  let fixture: ComponentFixture<UpdateMembershipComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateMembershipComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(UpdateMembershipComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
