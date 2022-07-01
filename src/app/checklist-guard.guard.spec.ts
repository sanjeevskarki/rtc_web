import { TestBed } from '@angular/core/testing';

import { ChecklistGuard } from './checklist-guard.guard';

describe('ChecklistGuard', () => {
  let guard: ChecklistGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(ChecklistGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
  
});
