import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AerolineasTrabajoComponent } from './aerolineas-trabajo.component';

describe('AerolineasTrabajoComponent', () => {
  let component: AerolineasTrabajoComponent;
  let fixture: ComponentFixture<AerolineasTrabajoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AerolineasTrabajoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AerolineasTrabajoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
