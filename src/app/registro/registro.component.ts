import { Component } from '@angular/core';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css'],
  imports: [FormsModule,CommonModule],
  standalone:true
})
export class RegistroComponent {
  email: string = '';
  password: string = '';
  loading: boolean = false;
  errorMessage: string = '';
  confirmPassword:string = '';
  

  constructor(private userService: UserService, private router: Router) {}

 onRegister() {
  console.log("Botón presionado");

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!this.email || !this.password || !this.confirmPassword) {
    this.errorMessage = "Ingresa correo y contraseña";
    return;
  }

  if (!emailRegex.test(this.email)) {
    this.errorMessage = "Formato de correo inválido";
    return;
  }

  if (this.password !== this.confirmPassword) {
    this.errorMessage = "Las contraseñas no coinciden";
    return;
  }

  this.errorMessage = ''; // Limpiar error si todo está bien

  this.userService.registerUser(this.email, this.password).subscribe({
    next: (response) => {
      console.log('Registro exitoso:', response);
      this.router.navigate(['/home']);
    },
    error: (error) => {
      console.error('Error en el registro:', error);
      this.errorMessage = 'Error en el registro. Verifica los datos ingresados.';
    }
  });
}

  
}
