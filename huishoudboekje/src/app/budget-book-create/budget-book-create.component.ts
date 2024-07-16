import { Component } from '@angular/core';
import { BudgetbookService } from '../services/budgetbook.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { BudgetBook } from '../models/budget-book.model';
import { Router } from '@angular/router';


@Component({
  selector: 'app-budget-book-create',
  templateUrl: './budget-book-create.component.html',
  styleUrl: './budget-book-create.component.css'
})
export class BudgetBookCreateComponent {

  budgetbookForm: FormGroup;

  constructor(private service: BudgetbookService, private formBuilder: FormBuilder, private router: Router) {
    this.budgetbookForm = this.formBuilder.group({
      name: new FormControl('', [Validators.required]),
      description: new FormControl('', [Validators.maxLength(255)]),
    })
    
  }

  onSubmit(): void{
    if(this.budgetbookForm.valid) {
      const value = this.budgetbookForm.value;
      const book = new BudgetBook('', value.name ?? '', value.description ?? '', false);
      this.service.addBudgetBook(book);
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
