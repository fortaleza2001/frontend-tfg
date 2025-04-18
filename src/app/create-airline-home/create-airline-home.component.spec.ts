import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateAirlineHomeComponent } from './create-airline-home.component';

describe('CreateAirlineHomeComponent', () => {
  let component: CreateAirlineHomeComponent;
  let fixture: ComponentFixture<CreateAirlineHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateAirlineHomeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateAirlineHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
