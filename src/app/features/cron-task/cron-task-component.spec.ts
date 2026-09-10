import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CronTaskComponent } from './cron-task-component';

describe('CronTaskComponent', () => {
  let component: CronTaskComponent;
  let fixture: ComponentFixture<CronTaskComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CronTaskComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CronTaskComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
