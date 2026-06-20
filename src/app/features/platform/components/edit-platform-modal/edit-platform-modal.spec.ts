import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditPlatformModal } from './edit-platform-modal';

describe('EditPlatformModal', () => {
  let component: EditPlatformModal;
  let fixture: ComponentFixture<EditPlatformModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditPlatformModal],
    }).compileComponents();

    fixture = TestBed.createComponent(EditPlatformModal);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
