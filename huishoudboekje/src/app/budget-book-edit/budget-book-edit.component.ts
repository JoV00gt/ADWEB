import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { BudgetbookService } from '../services/budgetbook.service';
import { BudgetBook } from '../models/budget-book.model';
import { Observable, tap } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-budget-book-edit',
  templateUrl: './budget-book-edit.component.html',
  styleUrl: './budget-book-edit.component.css'
})
export class BudgetBookEditComponent {

  budgetbookForm: FormGroup;

  budgetbook: Observable<BudgetBook | undefined>;

  constructor(private service: BudgetbookService,  private route: ActivatedRoute, private formBuilder: FormBuilder) {
    this.budgetbookForm = this.formBuilder.group({
      name: new FormControl('', [Validators.required]),
      description: new FormControl('', [Validators.maxLength(255)]),
      archived: new FormControl(false)
    });

    const selectedId = this.route.snapshot.paramMap.get('id') ?? "";
    this.budgetbook = this.service.getBudgetBook(selectedId).pipe(
      tap((book: BudgetBook | undefined) => {
        if (book) {
          this.budgetbookForm.patchValue({ //TODO: Maybe not best solution check for other solutions to get values into the form
            name: book.name,
            description: book.description,
            archived: book.archived
          });
        }
      })
    );
  }

  onSubmit(): void {
    if(this.budgetbookForm.valid) {
      const value = this.budgetbookForm.value;
      
      //Change the value of the current Book 
      //access the service to update book
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
