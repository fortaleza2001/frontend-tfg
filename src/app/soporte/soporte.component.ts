import { Component, OnInit, HostListener } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UserService } from '../services/user.service';
import { FormsModule } from '@angular/forms';
import {SoporteService} from '../services/soporte.service';

@Component({
  selector: 'app-soporte',
  imports: [CommonModule,FormsModule],
  templateUrl: './soporte.component.html',
  styleUrl: './soporte.component.css'
})
export class SoporteComponent implements OnInit 
{
  constructor(
    private http: HttpClient, 
    private cookieService: CookieService,
    private router: Router,
    private userService: UserService,
    private soporteService: SoporteService
  ) {}


  datosCargados=false;
  isLoggedIn: boolean = false; // Cambia este valor según el estado de autenticación
  username: string = '';
  isLoading: boolean = true; // Controla el estado de carga
  menuOpen = false;
  dropdownOpen = false;
  email: string = '';
  mensaje: string = '';
  mensajeExito: string = '';
  error=false;



  ngOnInit(): void {
    this.userService.checkAuthentication().subscribe(
      (response) => {
        if (response.user) {
          this.isLoggedIn = true;
          this.username = response.user.email; // O usa otra propiedad del usuario que desees
          console.log('Usuario autenticado:', response.user);
        } else {
          this.isLoggedIn = false;
          console.log('Usuario no autenticado');
        }
        this.isLoading = false;
        this.datosCargados=true;

      },
      (error) => {
        console.error('Error al comprobar la autenticación', error);
        this.isLoggedIn = false;
        this.isLoading = false;
        this.datosCargados=true;
        this.error = true;

      }
    );
  }
  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }
  logout(): void {
    this.userService.logout().subscribe(
      (response) => {
        console.log('Logout respuesta:', response);
        window.location.reload();
      },
      (error) => {
        console.error('Error al realizar el logout', error);
      }
    );
  }

  irAerolineas()
  {
    this.router.navigate(["/Aerolineas-home"]);
  }
  volverAlHome() {
    // Aquí puedes redirigir al home
    this.router.navigate(["/home"]);
  }

  enviarFormulario() {
    // Aquí puedes conectar con tu backend o enviar un correo
    this.isLoading = false;
    this.datosCargados=false;
    this.soporteService.postMandarSoporte(this.email , this.mensaje).subscribe(
      (response) => {
        console.log('Logout respuesta:', response);
        this.mensajeExito = 'Tu mensaje ha sido enviado. ¡Gracias por contactarnos!';
        this.email = '';
        this.mensaje = '';
        this.isLoading = false;
        this.datosCargados=true;
      },
      (error) => {
        console.error('Error al realizar el logout', error)
        this.mensajeExito = 'Tu mensaje ha sido enviado. ¡Gracias por contactarnos!';
        this.email = '';
        this.mensaje = '';
        this.isLoading = false;
        this.datosCargados=true;
      }
    );

    
  }

}
