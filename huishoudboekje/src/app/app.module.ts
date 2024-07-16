import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { BudgetBookOverviewComponent } from './budget-book-overview/budget-book-overview.component';
import { BudgetBookCreateComponent } from './budget-book-create/budget-book-create.component';
import { BudgetBookEditComponent } from './budget-book-edit/budget-book-edit.component';
import { SearchPipe } from './pipes/search.pipe';

@NgModule({
  declarations: [
    AppComponent,
    BudgetBookOverviewComponent,
    BudgetBookCreateComponent,
    BudgetBookEditComponent,
    SearchPipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule
  ],
  providers: [
    provideClientHydration()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
