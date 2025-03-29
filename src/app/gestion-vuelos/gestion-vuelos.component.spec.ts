import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionVuelosComponent } from './gestion-vuelos.component';

describe('GestionVuelosComponent', () => {
  let component: GestionVuelosComponent;
  let fixture: ComponentFixture<GestionVuelosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GestionVuelosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GestionVuelosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
