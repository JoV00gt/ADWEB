import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BudgetBookCreateComponent } from './budget-book-create.component';

describe('BudgetBookCreateComponent', () => {
  let component: BudgetBookCreateComponent;
  let fixture: ComponentFixture<BudgetBookCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BudgetBookCreateComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BudgetBookCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
