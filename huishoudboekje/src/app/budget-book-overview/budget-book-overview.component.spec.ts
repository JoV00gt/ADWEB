import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BudgetBookOverviewComponent } from './budget-book-overview.component';

describe('BudgetBookOverviewComponent', () => {
  let component: BudgetBookOverviewComponent;
  let fixture: ComponentFixture<BudgetBookOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BudgetBookOverviewComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BudgetBookOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
