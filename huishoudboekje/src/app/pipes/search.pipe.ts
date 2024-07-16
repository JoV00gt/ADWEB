import { Pipe, PipeTransform } from '@angular/core';
import { BudgetBook } from '../models/budget-book.model';

@Pipe({
  name: 'search'
})

export class SearchPipe implements PipeTransform {

  transform(books: BudgetBook[], term: string): BudgetBook[] {
    if (!term) return books

    term = term.toLowerCase();
    return books.filter(book => 
      (book.name && book.name.toLowerCase().includes(term)) ||
      (book.description && book.description.toLowerCase().includes(term))
    );
  }

}
