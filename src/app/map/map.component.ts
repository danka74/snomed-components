import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { Form, FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { SnomedAutocompleteComponent } from '../snomed-autocomplete/snomed-autocomplete.component';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {

  public countries: any[] = [
    {
      name: 'Svenska',
      top: '32%',
      left: '45%',
      url: 'http://snomed.info/sct/45991000052106',
      lang: 'sv-X-46011000052107'
    },
    {
      name: 'Dansk',
      top: '40%',
      left: '40%',
      url: 'http://snomed.info/sct/554471000005108',
      lang: 'da'
    },
    {
      name: 'Norsk',
      top: '25%',
      left: '35%',
      url: 'http://snomed.info/sct/51000202101',
      lang: 'no'
    },
    {
      name: 'Nederlands',
      top: '52%',
      left: '32%',
      url: 'http://snomed.info/sct/11000146104',
      lang: 'nl'
    },
    {
      name: 'English',
      top: '45%',
      left: '21%',
      url: 'http://snomed.info/sct',
      lang: 'en-X-900000000000508004'
    },
  ];

  @ViewChildren('country') countryComponents: QueryList<SnomedAutocompleteComponent>;

  form: FormGroup;

  constructor(fb: FormBuilder) { }

  ngAfterViewInit(): void {

  }

  ngOnInit(): void {
    this.form = new FormGroup({
      countries: new FormArray([])});

    this.form.valueChanges.subscribe(x => {
      console.log(x);
    });
  }

  onChange(value: string, i: number) {
    /* console.log(value);
    console.log(JSON.stringify(value));
    console.log(value);
    console.log(value.length);
    // value.forEach(e => console.log(e));
    this.countryComponents.forEach((countryComponent, index) => {
      if (index !== i) {
        console.log(this.countries[index].name);
        //countryComponent.conceptId = '404684003';
      }
    })*/
  }
}
