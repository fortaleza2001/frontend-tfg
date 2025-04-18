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
    if (!this.email || !this.password || !this.confirmPassword) {
      console.log("ingresa correo y contraseña");
      return;
    }

    this.userService.registerUser(this.email,this.password).subscribe({
      next: (response) => {
        console.log('Login exitoso:', response);
        this.router.navigate(['/home']);
      },
      error: (error) => {
        console.error('Error en el login:', error);
        console.log( 'Error en el inicio de sesión. Verifique sus credenciales.');
      }

    })
   
    // Resto de la lógica
  }
  
}
