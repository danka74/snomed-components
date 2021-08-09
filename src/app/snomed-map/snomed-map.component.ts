import { ViewChild } from '@angular/core';
import { Input } from '@angular/core';
import { ElementRef } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { of, Subject } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { SnomedService } from '../snomed.service';

@Component({
  selector: 'app-snomed-map',
  templateUrl: './snomed-map.component.html',
  styleUrls: ['./snomed-map.component.css']
})
export class SnomedMapComponent implements OnInit {

  snomedForm: FormGroup = new FormGroup({
    mapTarget: new FormControl()
  });

  @ViewChild('mapTarget') mapTarget: ElementRef<HTMLSpanElement>;

  displayUpdate: Subject<any> = new Subject();

  constructor(private snomedService: SnomedService) { }

  ngOnInit(): void {
    this.displayUpdate.pipe(
      switchMap((value: any) => {
        console.log('getMap');
        if (value.conceptId !== '') {
          return this.snomedService.getMap(value.conceptId, value.mapId);
        } else {
          return of(['']);
        }
      }),
      map((mapTargets: string[]) => {
        console.log('reduce');
        console.log(mapTargets);
        return mapTargets.reduce((prev, curr) => prev + ' ' + curr, '');
      })
    ).subscribe((value: any) => {
      console.log(value);
      this.mapTarget.nativeElement.innerHTML = value;
    });
  }

  private _conceptId: string = '';
  private _mapId: string = '';

  @Input() set conceptId(conceptId: string) {
    console.log(conceptId);
    this._conceptId = conceptId.substr(0, conceptId.indexOf('|')).trim();
    this.updateDisplay();
  }

  @Input() set mapId(mapId: string) {
    console.log(mapId);
    const m = mapId.match(/[0-9]+/i);
    console.log(m);
    if (m && m.length > 0) {
      this._mapId = m[0];
    }
    this.updateDisplay();
  }

  updateDisplay() {
    console.log('updateDisplay');
    if (this._conceptId && this._conceptId.length > 0 &&
      this._mapId && this._mapId.length > 0) {
      this.displayUpdate.next({
        conceptId: this._conceptId,
        mapId: this._mapId,
      });
    } else {
      console.log('empty display');
      this.displayUpdate.next({
        conceptId: '',
        mapId: '',
      });
    }
  }

}
