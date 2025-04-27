import { Component, OnInit, HostListener } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UserService } from '../services/user.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-flight-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './flight-list.component.html'
})
export class FlightListComponent implements OnInit {

  constructor(
    private http: HttpClient, 
    private cookieService: CookieService,
    private router: Router,
    private userService: UserService
  ) {}
  vuelos = Array.from({ length: 35 }).map((_, i) => ({
    origen: `Ciudad ${i % 5 + 1}`,
    destino: `Destino ${i % 7 + 1}`,
    fechaSalida: new Date('2025-05-01T10:00:00'),
    fechaLlegada: new Date('2025-05-01T18:00:00'),
    tipos: [
      { nombre: 'Económico', precio: 100 + i * 10, },
      { nombre: 'Business', precio: 150 + i * 10 },
      { nombre: 'Primera Clase', precio: 200 + i * 10 }
    ]
  }));
  

  // Filtros
  filtroOrigen: string = '';
  filtroDestino: string = '';
  filtroPrecio: number | null = null;

  // Paginación
  paginaActual = 1;
  vuelosPorPagina = 10;

  datosCargados=false;
  isLoggedIn: boolean = false; // Cambia este valor según el estado de autenticación
  username: string = '';
  isLoading: boolean = true; // Controla el estado de carga
  menuOpen = false;

  cantidades: number[][] = [];


  inicializarCantidades() {
    this.cantidades = this.vuelos.map(vuelo =>
      vuelo.tipos.map(() => 0)
    );
  }
  
  incrementarCantidad(i: number, j: number) {
    this.cantidades[i][j]++;
  }
  
  decrementarCantidad(i: number, j: number) {
    if (this.cantidades[i][j] > 0) {
      this.cantidades[i][j]--;
    }
  }
  
  comprarVuelo(i: number) {
    const vuelo = this.vuelosFiltradosPaginados[i];
    const seleccion = vuelo.tipos.map((tipo, j) => ({
      tipo: tipo.nombre,
      cantidad: this.cantidades[i][j],
      precio: tipo.precio
    })).filter(t => t.cantidad > 0);
  
    console.log('Compra realizada para:', vuelo);
    console.log('Detalles:', seleccion);
  
    // Aquí puedes abrir un modal, redirigir o procesar la compra
  }
  
  dropdownOpen = false;

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  ngOnInit(): void {
    this.inicializarCantidades();
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

  get vuelosFiltrados() {
    return this.vuelos.filter(v =>
      (!this.filtroOrigen || v.origen.toLowerCase().includes(this.filtroOrigen.toLowerCase())) &&
      (!this.filtroDestino || v.destino.toLowerCase().includes(this.filtroDestino.toLowerCase())) &&
      (!this.filtroPrecio || Math.min(...v.tipos.map(t => t.precio)) <= this.filtroPrecio)
    );
  }
  

  get totalPaginasFiltradas(): number {
    return Math.ceil(this.vuelosFiltrados.length / this.vuelosPorPagina);
  }

  get vuelosFiltradosPaginados() {
    const start = (this.paginaActual - 1) * this.vuelosPorPagina;
    return this.vuelosFiltrados.slice(start, start + this.vuelosPorPagina);
  }

  paginaAnterior() {
    if (this.paginaActual > 1) {
      this.paginaActual--;
      this.scrollAlInicio();
    }
  }
  
  paginaSiguiente() {
    if (this.paginaActual < this.totalPaginasFiltradas) {
      this.paginaActual++;
      this.scrollAlInicio();
    }
  }
  
  scrollAlInicio() {
    const lista = document.getElementById('lista-vuelos');
    if (lista) {
      lista.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }
}
