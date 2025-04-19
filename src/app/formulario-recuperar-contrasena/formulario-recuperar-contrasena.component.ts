import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
 // Suponiendo que tienes un servicio de autenticación

@Component({
  selector: 'app-recuperar-contrasena',
  templateUrl: './formulario-recuperar-contrasena.component.html',
  styleUrls: ['./formulario-recuperar-contrasena.component.css'],
})
export class RecuperarContraseñaComponent {
  formulario: FormGroup;
  mensajeError: string | null = null;
  mensajeExito: string | null = null;

  constructor(
    private fb: FormBuilder,
    
    private router: Router
  ) {
    this.formulario = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  recuperarContraseña() {
    if (this.formulario.valid) {
     
    }
  }
}
