import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { from, Observable } from 'rxjs';


@Injectable()
export class SnomedService {

  readonly baseUrl: string = '/snowstorm/snomed-ct/fhir/';

  // ValueSet/$expand?url=http://snomed.info/sct/45991000052106?";
  // readonly baseUrl: string = 'http://localhost:4200/MAIN/SNOMEDCT-SE/concepts?activeFilter=true';


  constructor(private http: HttpClient) { }

  search(term: string, ecl: string, url: string, lang: string): Observable<any> {

    const httpOptions = {
      headers: new HttpHeaders({
        // 'Content-Type':  'application/json',
        'Accept': 'application/json',
        'Accept-Language': lang || 'en',
      })
    };
    if (term && term.length > 0) {
      const sctid = parseInt(term);
      if (isNaN(sctid)) {
        return this.http.get(this.baseUrl + 'ValueSet/$expand?url=' + url + '?fhir_vs=ecl/' +
          ((ecl && ecl.length > 0) ? encodeURIComponent(ecl) : '<<404684003') + // default to Clinical finding
          '&filter=' + encodeURIComponent(term) + '&offset=0&count=10', httpOptions);
      } else {
        return this.http.get(this.baseUrl + 'ValueSet/$expand?url=' + url + '?fhir_vs=ecl/' +
          encodeURIComponent(term) + ((ecl && ecl.length > 0) ? ' AND ' + ecl : '') +
          '&offset=0&count=10', httpOptions);
      }
    } else {
        return from([]);
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
