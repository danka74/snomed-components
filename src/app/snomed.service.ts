import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { from, Observable } from 'rxjs';


@Injectable()
export class SnomedService {

  readonly baseUrl: string = "/snowstorm/snomed-ct/fhir/ValueSet/$expand?url=http://snomed.info/sct/45991000052106?";
  // readonly baseUrl: string = 'http://localhost:4200/MAIN/SNOMEDCT-SE/concepts?activeFilter=true';


  constructor(private http: HttpClient) { }

  search(term: string, ecl: string, langRefset: string): any {

    console.log(ecl);
    console.log(langRefset);

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'Accept-Language': 'sv' + (langRefset !== undefined ? '-X-' + langRefset : ''),
      })
    };
    if (term && term.length > 0) {
      return this.http.get('/snowstorm/snomed-ct/fhir/ValueSet/$expand?url=http://snomed.info/sct/45991000052106?fhir_vs=ecl/' +
         ((ecl != null && ecl !== '') ? encodeURIComponent(ecl) : '<<404684003') + // default to Clinical finding
         '&filter=' + encodeURIComponent(term) + '&offset=0&count=10', httpOptions);
    } else {
        return [];
    }
  }

  getMap(conceptId: string, mapId: string) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'Accept-Language': 'sv',
      })
    };
    if (conceptId && conceptId.length > 0) {
      return this.http.get('/snowstorm/snomed-ct/MAIN/SNOMEDCT-SE/MAPTEST1/members?referenceSet=' +
        mapId + '&referencedComponentId=' + conceptId + '&offset=0&limit=10', httpOptions).pipe(
           map((data: any) => {
             const result = [];
             data.items.forEach(element => {
               result.push(element.additionalFields.mapTarget);
             });
             return result;
           })
         );
    } else {
        return from([]);
    }
  }

}
