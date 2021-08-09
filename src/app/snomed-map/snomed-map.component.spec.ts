import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SnomedMapComponent } from './snomed-map.component';

describe('SnomedMapComponent', () => {
  let component: SnomedMapComponent;
  let fixture: ComponentFixture<SnomedMapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SnomedMapComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SnomedMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
