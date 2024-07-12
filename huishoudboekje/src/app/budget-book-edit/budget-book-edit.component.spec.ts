import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BudgetBookEditComponent } from './budget-book-edit.component';

describe('BudgetBookEditComponent', () => {
  let component: BudgetBookEditComponent;
  let fixture: ComponentFixture<BudgetBookEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BudgetBookEditComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BudgetBookEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
