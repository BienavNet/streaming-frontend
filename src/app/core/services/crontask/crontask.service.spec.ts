import { TestBed } from '@angular/core/testing';

import { CrontaskService } from '../crontask/crontask.service';

describe('CrontaskService', () => {
  let service: CrontaskService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CrontaskService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
