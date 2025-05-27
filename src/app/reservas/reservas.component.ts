import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UserService } from '../services/user.service';
import { VuelosService } from '../services/vuelos.service';
import { FormsModule } from '@angular/forms';
import { forkJoin } from 'rxjs';  // Importa forkJoin

@Component({
  selector: 'app-reservas',
  imports: [CommonModule, FormsModule],
  templateUrl: './reservas.component.html',
  styleUrls: ['./reservas.component.css']  // Corregido styleUrl a styleUrls
})
export class ReservasComponent implements OnInit {

  datosCargados = false;
  isLoggedIn: boolean = false;
  username: string = '';
  isLoading: boolean = true;
  menuOpen = false;
  menuAbierto = false;
  searchTerm: string = '';
  vuelos: any = [];
  filteredFlights = [...this.vuelos];
  error = false;

  // Función para filtrar los vuelos
  filterFlights(): void {
    if (this.searchTerm.trim() === '') {
      this.filteredFlights = [...this.vuelos];
    } else {
      this.filteredFlights = this.vuelos.filter((vuelo: any) =>
        vuelo.origen.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        vuelo.destino.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        vuelo.fecha.includes(this.searchTerm)
      );
    }
  }

  // Función para obtener el color del estado del vuelo
  getStatusClass(estado: string): string {
    switch (estado) {
      case 'Confirmado':
        return 'text-green-600';
      case 'En Espera':
        return 'text-orange-500';
      case 'Cancelado':
        return 'text-red-600';
      default:
        return '';
    }
  }

  constructor(
    private http: HttpClient,
    private cookieService: CookieService,
    private router: Router,
    private userService: UserService,
    private vuelosService: VuelosService
  ) {}

  dropdownOpen = false;

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  obtenerReservas() {
    this.vuelosService.obtenerVueloReserva().subscribe(
      (response) => {
        const vuelos = response.vuelos;
        vuelos.forEach((vuelo: any) => {
          this.vuelos.push({
            id: vuelo.vuelo.id,
            origen: vuelo.aeropuerto_salida.name,
            destino: vuelo.aeropuerto_destino.name,
            fecha: new Date(vuelo.vuelo.fecha_salida).toISOString().split('T')[0],
            estado: vuelo.vuelo.estado
          });
        });
        this.filteredFlights = [...this.vuelos];
      },
      (error) => {
        console.error('Error al obtener los vuelos', error);
      }
    );
  }

  ngOnInit(): void {
    // Usamos forkJoin para ejecutar ambas peticiones simultáneamente
    forkJoin({
      vuelos: this.vuelosService.obtenerVueloReserva(),
      userAuth: this.userService.checkAuthentication()
    }).subscribe(
      (results) => {
        // Procesamos los resultados de ambas llamadas
        const { vuelos, userAuth } = results;

        // Manejar la respuesta de obtener los vuelos
        if (vuelos && vuelos.vuelos) {
          vuelos.vuelos.forEach((vuelo: any) => {
            this.vuelos.push({
              id: vuelo.vuelo.id,
              origen: vuelo.aeropuerto_salida.name,
              destino: vuelo.aeropuerto_destino.name,
              fecha: new Date(vuelo.vuelo.fecha_salida).toISOString().split('T')[0],
              estado: vuelo.vuelo.estado
            });
          });
          this.filteredFlights = [...this.vuelos];
        }

        // Manejar la respuesta de la autenticación
        if (userAuth.user) {
          this.isLoggedIn = true;
          this.username = userAuth.user.email;  // O usa otra propiedad del usuario que desees
        } else {
          this.isLoggedIn = false;
        }

        // Finalmente, cambia el estado de carga
        this.isLoading = false;
        this.datosCargados = true;
      },
      (error) => {
        console.error('Error al obtener los vuelos o comprobar la autenticación', error);
        this.isLoading = false;
        this.datosCargados = true;
        this.error =true;
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

  irAerolineas() {
    this.router.navigate(["/Aerolineas-home"]);
  }

  verReserva(id: any) {
    this.router.navigate(['reservas/vuelo', id]);
  }
  
  volverAlHome() {
    // Aquí puedes redirigir al home
    this.router.navigate(["/home"]);
  }

}
