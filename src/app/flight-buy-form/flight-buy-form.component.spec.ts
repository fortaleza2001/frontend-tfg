import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FlightBuyFormComponent } from './flight-buy-form.component';

describe('FlightBuyFormComponent', () => {
  let component: FlightBuyFormComponent;
  let fixture: ComponentFixture<FlightBuyFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FlightBuyFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FlightBuyFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
