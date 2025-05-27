import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionAerolineasComponent } from './gestion-aerolineas.component';

describe('GestionAerolineasComponent', () => {
  let component: GestionAerolineasComponent;
  let fixture: ComponentFixture<GestionAerolineasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GestionAerolineasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GestionAerolineasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
