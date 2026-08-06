import { TestBed } from '@angular/core/testing';

import { MembershipContextService } from '../membership-context-flow/membership-context-service';

describe('MembershipContextService', () => {
  let service: MembershipContextService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MembershipContextService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
