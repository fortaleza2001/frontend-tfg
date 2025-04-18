import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AerolineaPerfilComponent } from './aerolinea-perfil.component';

describe('AerolineaPerfilComponent', () => {
  let component: AerolineaPerfilComponent;
  let fixture: ComponentFixture<AerolineaPerfilComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AerolineaPerfilComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AerolineaPerfilComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
