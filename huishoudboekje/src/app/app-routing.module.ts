import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BudgetBookEditComponent } from './budget-book-edit/budget-book-edit.component';
import { BudgetBookCreateComponent } from './budget-book-create/budget-book-create.component';
import { BudgetBookOverviewComponent } from './budget-book-overview/budget-book-overview.component';

const routes: Routes = [
  { path: '', redirectTo: 'budgetbook', pathMatch: 'full' },
  { path: 'budgetbook/edit/:id', component: BudgetBookEditComponent},
  { path: 'budgetbook/create', component: BudgetBookCreateComponent },
  { path: 'budgetbook', component: BudgetBookOverviewComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
