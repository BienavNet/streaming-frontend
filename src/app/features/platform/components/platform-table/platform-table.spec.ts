import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlatformTable } from './platform-table';

describe('PlatformTable', () => {
  let component: PlatformTable;
  let fixture: ComponentFixture<PlatformTable>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlatformTable],
    }).compileComponents();

    fixture = TestBed.createComponent(PlatformTable);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
