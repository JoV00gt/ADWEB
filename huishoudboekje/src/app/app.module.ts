import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BudgetBookOverviewComponent } from './budget-book-overview/budget-book-overview.component';
import { BudgetBookCreateComponent } from './budget-book-create/budget-book-create.component';

@NgModule({
  declarations: [
    AppComponent,
    BudgetBookOverviewComponent,
    BudgetBookCreateComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [
    provideClientHydration()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
