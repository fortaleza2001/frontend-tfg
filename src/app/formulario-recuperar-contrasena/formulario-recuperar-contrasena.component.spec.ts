import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormularioRecuperarContrasenaComponent } from './formulario-recuperar-contrasena.component';

describe('FormularioRecuperarContrasenaComponent', () => {
  let component: FormularioRecuperarContrasenaComponent;
  let fixture: ComponentFixture<FormularioRecuperarContrasenaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormularioRecuperarContrasenaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormularioRecuperarContrasenaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
