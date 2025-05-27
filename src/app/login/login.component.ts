import { Component } from '@angular/core';
import { UserService } from '../services/user.service';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: true,
  imports: [FormsModule,CommonModule]
})
export class LoginComponent {
  email: string = '';
  password: string = '';
loginErrorMessage: string = '';

  constructor(private userService: UserService,private router: Router) {}

 onLogin() {
  if (!this.email || !this.password) {
    this.loginErrorMessage = 'Por favor, ingrese su correo y contraseña';
    return;
  }

  this.loginErrorMessage = ''; // Limpiar mensaje si todo está bien

  console.log("hola");
  console.log(this.email);
  console.log(this.password);

  this.userService.loginUser(this.email, this.password).subscribe({
    next: (response) => {
      console.log('Login exitoso:', response);
      this.router.navigate(['/home']);
    },
    error: (error) => {
      console.error('Error en el login:', error);
      this.loginErrorMessage = 'Error en el inicio de sesión. Verifique sus credenciales.';
    }
  });
}


  onLoginGithub() {
    this.userService.loginwithGithub();
  }
  onLoginGoogle(){
    this.userService.loginwithGoogle();
  }
  onLoginFacebook(){
    this.userService.loginwithFacebook();
  }

}
