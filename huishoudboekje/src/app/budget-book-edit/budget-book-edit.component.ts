import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { BudgetbookService } from '../services/budgetbook.service';
import { BudgetBook } from '../models/budget-book.model';
import { Observable, tap } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-budget-book-edit',
  templateUrl: './budget-book-edit.component.html',
  styleUrl: './budget-book-edit.component.css'
})
export class BudgetBookEditComponent {

  budgetbookForm: FormGroup;

  budgetbookId: string = '';

  budgetbook$: Observable<BudgetBook | undefined>;

  constructor(private service: BudgetbookService,  private route: ActivatedRoute, private formBuilder: FormBuilder, private router: Router) {
    const selectedId = this.route.snapshot.paramMap.get('id') ?? "";
    this.budgetbook$ = this.service.getBudgetBook(selectedId);

    this.budgetbookForm = this.formBuilder.group({
      name: new FormControl('', [Validators.required]),
      description: new FormControl('', [Validators.maxLength(255)]),
      archived: new FormControl(false)
    });
  }

  ngOnInit(): void {
    this.budgetbook$.subscribe((book: BudgetBook | undefined) => {
      if (book) {
        this.budgetbookId = book.id;
        this.budgetbookForm.patchValue({
          name: book.name,
          description: book.description,
          archived: book.archived
        });
      }
    });
  }

  onSubmit(): void {
    if(this.budgetbookForm.valid) {

      const updatedValues = this.budgetbookForm.value;
      const updatedBook: BudgetBook = {
        id: this.budgetbookId,
        name: updatedValues.name,
        description: updatedValues.description,
        archived: updatedValues.archived
      };

      this.service.updateBudgetBook(updatedBook);
      this.router.navigateByUrl('budgetbook');
    } else {
      this.markAllAsTouched();
    }
  }

  markAllAsTouched(): void {
    Object.keys(this.budgetbookForm.controls).forEach(field => {
      const control = this.budgetbookForm.get(field);
      if(control) {
        control.markAsTouched({ onlySelf: true });
      }
    });
  }

  getFormControlErrors(controlName: string): string[] {
    const control = this.budgetbookForm.get(controlName);
    if (!control || !control.errors || !control.touched) {
      return [];
    }

    const errorMessages: { [key: string]: string } = {
      required: 'dit veld is verplicht',
      maxlength: 'Beschrijving moet niet meer dan 255 karakters bevatten',
    };

    return Object.keys(control.errors).map(errorKey => errorMessages[errorKey]);
  }

}
