import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BudgetBookEditComponent } from './budget-book-edit/budget-book-edit.component';
import { BudgetBookCreateComponent } from './budget-book-create/budget-book-create.component';

const routes: Routes = [
  { path: 'budgetbook/edit/:id', component: BudgetBookEditComponent},
  { path: 'budgetbook/create', component: BudgetBookCreateComponent }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
