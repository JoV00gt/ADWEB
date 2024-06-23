import { Component } from '@angular/core';
import { BudgetbookService } from '../services/budgetbook.service';

@Component({
  selector: 'app-budget-book-create',
  templateUrl: './budget-book-create.component.html',
  styleUrl: './budget-book-create.component.css'
})
export class BudgetBookCreateComponent {

  constructor(private service: BudgetbookService) {
  }

  onAdd(){
    
  }

}
