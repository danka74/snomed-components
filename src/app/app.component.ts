import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { SnomedAutocompleteComponent } from './snomed-autocomplete/snomed-autocomplete.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {

  @ViewChild('levnadsvanor') levnadsvanor: SnomedAutocompleteComponent; // ElementRef<HTMLInputElement>;
  @ViewChild('annat') annat: SnomedAutocompleteComponent; // ElementRef<HTMLInputElement>;

  constructor() {
  }

  ngOnInit() {

  }


}
