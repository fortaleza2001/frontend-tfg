import { Component } from '@angular/core';
import { UserService } from '../services/user.service';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: true,
  imports: [FormsModule]
})
export class LoginComponent {
  email: string = '';
  password: string = '';


  constructor(private userService: UserService,private router: Router) {}

  onLogin() {
    if (!this.email || !this.password) {
      console.log( 'Por favor, ingrese su correo y contraseña');
      return;
    }
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
        console.log( 'Error en el inicio de sesión. Verifique sus credenciales.');
      }
    });
  }


}
