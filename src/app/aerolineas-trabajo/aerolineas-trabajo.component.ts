import { Component, OnInit, HostListener } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UserService } from '../services/user.service';
import { AerolineaService } from '../services/aerolinea.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-aerolineas-trabajo',
  imports: [CommonModule],
  templateUrl: './aerolineas-trabajo.component.html',
  styleUrl: './aerolineas-trabajo.component.css'
})
export class AerolineasTrabajoComponent implements OnInit {

  constructor(
    private http: HttpClient, 
    private cookieService: CookieService,
    private router: Router,
    private userService: UserService,
    private aerolineaService: AerolineaService
  ) {}
  datosCargados=false;
  isLoggedIn: boolean = false; // Cambia este valor según el estado de autenticación
  username: string = '';
  isLoading: boolean = true; // Controla el estado de carga
  menuOpen = false;
  menuAbierto = false;
  dropdownOpen = false;

  aerolineas :any = [
    
  ];
  

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  

  ngOnInit(): void {
    let aerolineasCargadas = false;
    let authCargado = false;
  
    const revisarCargaCompleta = () => {
      if (aerolineasCargadas && authCargado) {
        this.datosCargados = true;
        this.isLoading = false;
      }
    };
  
    // Cargar aerolíneas
    this.aerolineaService.getAerolineas().subscribe({
      next: (response) => {
        const lista = response.contenido;
        for (let x = 0; x < lista.length; x++) {
          const nueva = {
            nombre: lista[x].nombre,
            logo: lista[x].logoAerolinea
              ? lista[x].logoAerolinea
              : "https://d1csarkz8obe9u.cloudfront.net/posterpreviews/airplane-icon-design-template-091387dad5f996aad36dfcdf261f9130_screen.jpg?ts=1624541467"
          };
          this.aerolineas.push(nueva);
        }
        aerolineasCargadas = true;
        revisarCargaCompleta();
      },
      error: (error) => {
        console.error('Error al cargar aerolíneas', error);
        aerolineasCargadas = true;
        revisarCargaCompleta();
      }
    });
  
    // Verificar autenticación
    this.userService.checkAuthentication().subscribe({
      next: (response) => {
        if (response.user) {
          this.isLoggedIn = true;
          this.username = response.user.email;
          console.log('Usuario autenticado:', response.user);
        } else {
          this.isLoggedIn = false;
          console.log('Usuario no autenticado');
        }
        authCargado = true;
        revisarCargaCompleta();
      },
      error: (error) => {
        console.error('Error en autenticación', error);
        this.isLoggedIn = false;
        authCargado = true;
        revisarCargaCompleta();
      }
    });
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
}
