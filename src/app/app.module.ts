import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { SnomedService } from './snomed.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';

import { AppComponent } from './app.component';
import { SnomedAutocompleteComponent } from './snomed-autocomplete/snomed-autocomplete.component';
import { LayoutModule } from '@angular/cdk/layout';
import {MatCardModule} from '@angular/material/card';
import {MatDividerModule} from '@angular/material/divider';



@NgModule({
  declarations: [
    AppComponent,
    SnomedAutocompleteComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule, ReactiveFormsModule,
    BrowserAnimationsModule,
    MatInputModule, MatFormFieldModule, MatAutocompleteModule, MatOptionModule, MatChipsModule, MatIconModule,
    MatCheckboxModule, LayoutModule, MatToolbarModule, MatButtonModule, MatSidenavModule, MatListModule, MatCardModule,
    MatDividerModule,
  ],
  providers: [
    SnomedService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
