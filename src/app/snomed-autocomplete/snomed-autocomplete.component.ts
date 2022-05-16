import { Component, OnInit, Input, HostBinding, EventEmitter, ElementRef, ViewChild, Optional, Self, Renderer2, Output } from '@angular/core';
import { SnomedService } from '../snomed.service';
import { ControlValueAccessor, FormControl, FormGroup, NgControl, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Subscription, Subject } from 'rxjs';
import {
  filter,
  debounceTime,
  distinctUntilChanged,
  switchMap,
  tap
} from 'rxjs/operators';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatFormFieldControl } from '@angular/material/form-field';
import { FocusMonitor } from '@angular/cdk/a11y';
import { coerceBooleanProperty } from '@angular/cdk/coercion';

@Component({
  selector: 'app-snomed-autocomplete',
  templateUrl: './snomed-autocomplete.component.html',
  styleUrls: ['./snomed-autocomplete.component.css'],
  providers: [
    {
      provide: MatFormFieldControl,
      useExisting: SnomedAutocompleteComponent
    },
    // {
    //  provide: NG_VALUE_ACCESSOR,
    //  useExisting: forwardRef(() => SnomedAutocompleteComponent),
    //  multi: true
    // }
  ],
})
export class SnomedAutocompleteComponent implements OnInit, MatFormFieldControl<string[]>, ControlValueAccessor {
  static nextId = 0;
  @HostBinding() id = `snomed-autocomplete-${SnomedAutocompleteComponent.nextId++}`;
  // snomed form related properties
  @Input() ecl: string;
  @Input() multi: boolean = false;
  @Input() lang: string;
  @Input() url: string = 'http://snomed.info/sct';
  @Input() parentForm: FormGroup;

  @Output() changed: EventEmitter<string[]> = new EventEmitter();
  result = [];

  onChange = null;

  snomedForm: FormGroup = new FormGroup({
    search: new FormControl()
  });

  typeaheadSubscription: Subscription = null;

  set value(sel: string[] | null) {
    if (!sel) {
      this._selection = [];
    } else {
      this._selection = sel;
    }
    this.stateChanges.next();
  }

  public get value(): string[] {
    
    return this._selection;
  }

  public get firstSelected(): string {
    return this._selection[0];
  }

  _selection: string[] = [];

  @ViewChild('search') search: ElementRef<HTMLInputElement>;

  // material forms related properties
  @Input()
  get placeholder() {
    return this._placeholder;
  }
  set placeholder(plh) {
    this._placeholder = plh;
    this.stateChanges.next();
  }
  private _placeholder: string;

  set conceptId(sctid: string) {
    const search = this.snomedService.search(sctid, this.ecl, this.url, this.lang);
    search.subscribe(data => {
      const res = data['expansion']['contains'];
      if (res) {
        this.value.push(res[0].code + ' | ' + res[0].display + ' |');
        this.search.nativeElement.value = '';
        this.stateChanges.next();
      }
    });
  }

  stateChanges = new Subject<void>();

  focused = false;

  // ngControl: NgControl = null;
  
  constructor(
    @Optional() @Self() public ngControl: NgControl,
    private snomedService: SnomedService,
    private fm: FocusMonitor,
    private elRef: ElementRef<HTMLElement>,
    private renderer: Renderer2) {
      // if (this.ngControl != null) {
      //   // Setting the value accessor directly (instead of using
      //   // the providers) to avoid running into a circular import.
      //   this.ngControl.valueAccessor = this;
      // }
      fm.monitor(elRef.nativeElement, true).subscribe(origin => {
        this.focused = !!origin;
        this.stateChanges.next();
      });
  }

  writeValue(obj: any): void {
    this.value = obj;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {

  }

  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  get empty() {
    // console.log('empty() ' + (this.search ? this.search.nativeElement.value : ''));
    return this._selection.length === 0 && !(this.search ? this.search.nativeElement.value : false);
  }

  @HostBinding('class.floating')
  get shouldLabelFloat() {
    // console.log('float?: ' + (this.focused) + ' ' + (!this.empty));
    return this.focused || !this.empty;
  }

  @Input()
  get required() {
    return this._required;
  }
  set required(req) {
    this._required = coerceBooleanProperty(req);
    this.stateChanges.next();
  }
  private _required = false;

  @Input()
  get disabled(): boolean { return this._disabled; }
  set disabled(value: boolean) {
    this._disabled = coerceBooleanProperty(value);
    this._disabled ? this.snomedForm.disable() : this.snomedForm.enable();
    this.stateChanges.next();
  }
  private _disabled = false;

  errorState = false;

  controlType = 'snomed-autocomplete';

  @HostBinding('attr.aria-describedby') describedBy = '';

  setDescribedByIds(ids: string[]) {
    this.describedBy = ids.join(' ');
  }

  onContainerClick(event: MouseEvent) {
    if ((event.target as Element).tagName.toLowerCase() !== 'input') {
      this.search.nativeElement.focus();
    }
  }

  ngOnInit() {
    if(this.parentForm) {
      this.snomedForm.setParent(this.parentForm);
    }
    const typeahead = this.snomedForm.get('search').valueChanges.pipe(
      filter(text => text.length > 2),
      debounceTime(10),
      distinctUntilChanged(),
      // tap(console.log),
      switchMap(text => this.snomedService.search(text, this.ecl, this.url, this.lang))
    );
    this.typeaheadSubscription = typeahead.subscribe(data => {
      if (this.multi || this._selection.length === 0) {
        this.result = [];
        const res = data['expansion']['contains'];
        if (res) {
          if (res.length === 1) {
            this.value.push(res[0].code + ' | ' + res[0].display + ' |');
            this.search.nativeElement.value = '';
            this.stateChanges.next();
          } else {
            res.forEach((element: any) =>
              this.result.push(element.code + ' | ' + element.display + ' |'));
          }
        }
      }
    });
  }

  ngOnDestroy() {
    this.stateChanges.complete();
    this.fm.stopMonitoring(this.elRef.nativeElement);
  }

  select(event: MatAutocompleteSelectedEvent): void {
    //console.log(this.search.nativeElement.value);
    const option = event.option;

    if ((option.value || '').trim()) {
      this.value.push(option.value.trim());
      //console.log(option.value);

      this.search.nativeElement.value = '';

      this.result = [];

      this.stateChanges.next();

      this.changed.emit(this.value);
    }

  }

  remove(concept: any): void {
    const index = this.value.indexOf(concept);

    if (index >= 0) {
      this.value.splice(index, 1);
    }

    this.stateChanges.next();
  }

  clear(event: MatChipInputEvent): void {
    // console.log(event);

    this.search.nativeElement.value = '';

    this.stateChanges.next();

  }

  onLimit() {
    console.log('onLimit()');
    if (this.typeaheadSubscription != null) {
      this.typeaheadSubscription.unsubscribe();
      this.ngOnInit();
    }
  }
}
