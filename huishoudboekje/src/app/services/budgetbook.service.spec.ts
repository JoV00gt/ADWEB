import { TestBed } from '@angular/core/testing';

import { BudgetbookService } from './budgetbook.service';

describe('BudgetbookService', () => {
  let service: BudgetbookService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BudgetbookService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
