import { Component } from '@angular/core';

import { Router } from '@angular/router';
import {UserService} from '../services/user.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
 // Suponiendo que tienes un servicio de autenticación

@Component({
  selector: 'app-recuperar-contrasena',
  templateUrl: './formulario-recuperar-contrasena.component.html',
  styleUrls: ['./formulario-recuperar-contrasena.component.css'],
  imports:[FormsModule,CommonModule]
})
export class RecuperarContraseñaComponent {

  mensajeError: string | null = null;
  mensajeExito: string | null = null;
  email: string = '';

  constructor(

    private userService:UserService,
    private router: Router
  ) {
    
  }

  recuperarContrasena() {
    console.log("intento");
  
      const email = this.email;

      this.userService.solicitarCambioPassword(email).subscribe({
        next: (response) => {
          console.log(response);
          this.mensajeExito = response.message; // Suponiendo que la respuesta tiene un campo 'message'
          this.mensajeError = null;
        },
        error: (err) => {
          console.error(err);
          this.mensajeError = err.error.error || 'Hubo un error al procesar tu solicitud'; // Maneja el error según la respuesta del backend
          this.mensajeExito = null;
        },
      });
    
  }
}
