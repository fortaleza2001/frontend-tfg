import { Component, OnInit, HostListener } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UserService } from '../services/user.service';
import { FormBuilder, FormGroup,Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms'; // <-- AÑADE ESTO
import { MatTooltipModule } from '@angular/material/tooltip'; // Importa el módulo de Tooltip
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  imports: [CommonModule,ReactiveFormsModule,MatTooltipModule]
})
export class HomeComponent implements OnInit {
  datosCargados=false;
  isLoggedIn: boolean = false; // Cambia este valor según el estado de autenticación
  username: string = '';
  isLoading: boolean = true; // Controla el estado de carga
  menuOpen = false;
  menuAbierto = false;
  busquedaForm: FormGroup;
  errorMensaje: string = '';
  constructor(
    private http: HttpClient, 
    private cookieService: CookieService,
    private router: Router,
    private userService: UserService,
    private fb: FormBuilder,
  ) {
    this.busquedaForm = this.fb.group({
      paisOrigen: ['', Validators.required],
      origen: ['', Validators.required],
      paisDestino: ['', Validators.required],
      destino: ['', Validators.required],
      fechaSalida: ['', Validators.required],
      pasajeros: [1, [Validators.required, Validators.min(1)]]
    });
  }
  dropdownOpen = false;


  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

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

      }
    );
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


  enviar() {
    if (this.busquedaForm.invalid) {
      this.errorMensaje = 'Por favor completa todos los campos del formulario correctamente.';
      return;
    }
  
    this.errorMensaje = ''; // Limpia el error si todo está bien
    const valores = this.busquedaForm.value;
    this.router.navigate(['/buscar/vuelos'], { queryParams: valores });
  }
  


}
