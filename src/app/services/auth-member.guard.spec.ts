import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { authMemberGuard } from './auth-member.guard';

describe('authMemberGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => authMemberGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
