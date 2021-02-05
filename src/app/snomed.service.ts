import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';


@Injectable()
export class SnomedService {

  readonly baseUrl: string = "http://localhost:4200/fhir/ValueSet/$expand?url=http://snomed.info/sct/45991000052106?";
  // readonly baseUrl: string = 'http://localhost:4200/MAIN/SNOMEDCT-SE/concepts?activeFilter=true';


  constructor(private http: HttpClient) { }

  search(term: string, ecl: string): any {

    console.log(ecl);

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'Accept-Language': 'sv-X-64311000052107',
      })
    };
    if (term && term.length > 0) {
      return this.http.get(this.baseUrl + 'fhir_vs=ecl/' +
         ((ecl != null && ecl !== '') ? encodeURIComponent(ecl) : '<<404684003') + // default to Clinical finding
         '&filter=' + encodeURIComponent(term) + '&offset=0&count=10', httpOptions);
    } else {
        return [];
    }
  }

}
