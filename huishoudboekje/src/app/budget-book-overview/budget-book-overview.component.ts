import { Component } from '@angular/core';
import { BudgetbookService } from '../services/budgetbook.service';
import { BudgetBook } from '../models/budget-book.model';

@Component({
  selector: 'app-budget-book-overview',
  templateUrl: './budget-book-overview.component.html',
  styleUrl: './budget-book-overview.component.css'
})

export class BudgetBookOverviewComponent {

  budgetbooks: BudgetBook[] = [];
  term: string = '';

  constructor(private service: BudgetbookService) {
    service.getBudgetBooks().subscribe(books => {
        this.budgetbooks = books;
    })
  }

}
