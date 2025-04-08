import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  imports: [CommonModule]
})
export class HomeComponent implements OnInit {
  isLoggedIn: boolean = false; // Cambia este valor según el estado de autenticación
  username: string = '';
  isLoading: boolean = true; // Controla el estado de carga

  constructor(
    private http: HttpClient, 
    private cookieService: CookieService,
    private router: Router,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    // Comprobamos si el usuario está autenticado
    this.userService.checkAuthentication().subscribe(
      (response) => {
        if (response.user) { // Si hay un usuario en la respuesta, el usuario está autenticado
          this.isLoggedIn = true;
          this.username = response.user.email; // Puedes cambiar esto dependiendo de la estructura del usuario
          console.log('Usuario autenticado:', response.user);
        } else {
          this.isLoggedIn = false;
          console.log('Usuario no autenticado');
        }
        this.isLoading = false; // Terminamos la carga
      },
      (error) => {
        console.error('Error al comprobar la autenticación', error);
        this.isLoggedIn = false; // Si hay un error, asumimos que el usuario no está autenticado
        this.isLoading = false; // Terminamos la carga
      }
    );

    
  }
  logout(): void {
    this.userService.logout().subscribe(
      (response) => {
        console.log('Logout respuesta:', response);  // Muestra la respuesta en la consola
        window.location.reload();
      },
      (error) => {
        console.error('Error al realizar el logout', error);  // Maneja cualquier error
      }
    );
  }
  
}
