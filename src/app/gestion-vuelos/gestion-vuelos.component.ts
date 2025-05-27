import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VuelosService } from '../services/vuelos.service';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';

// Definir la interfaz Vuelo
interface Vuelo {
  id:string
  codigo: string;
  origen: string;
  destino: string;
  hora: Date;
  estado: string;  // Agregado estado para los vuelos
  origen_ciudad: string;
  destino_ciudad: string;
}

@Component({
  selector: 'app-gestion-vuelos',
  templateUrl: './gestion-vuelos.component.html',
  styleUrls: ['./gestion-vuelos.component.css'],
  imports: [CommonModule]
})
export class GestionVuelosComponent implements OnInit {
  constructor(private vuelos_service: VuelosService, private route: ActivatedRoute,private userService: UserService,private router: Router,) {}

  datosCargados=false;
  id_aerolinea: any = '';
  vuelos: Vuelo[] = []; // Lista de vuelos desde la API
  vuelosFiltrados: Vuelo[] = []; // Lista de vuelos filtrados
  vuelosPaginados: Vuelo[] = []; // Lista de vuelos en la página actual
  paginaActual = 1;
  elementosPorPagina = 5;
  totalPaginas = 1;
  totalVuelos: number = 0; // Total de vuelos
  successMessage: string | null = null;
  isLoggedIn: boolean = false; // Cambia este valor según el estado de autenticación
  username: string = '';
  isLoading: boolean = true; // Controla el estado de carga
  menuOpen = false;
  menuAbierto = false;
  dropdownOpen = false;
  errorMensaje: string = '';
  error = false;
  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }


 ngOnInit(): void {
  this.id_aerolinea = this.route.snapshot.paramMap.get('id');

  let authFinalizado = false;
  let vuelosFinalizado = false;

  const comprobarCargaCompleta = () => {
    if (authFinalizado && vuelosFinalizado) {
      this.datosCargados = true;
      this.isLoading = false;
    }
  };

  // Llamada 1: Autenticación
  this.userService.checkAuthentication().subscribe(
    (response) => {
      if (response.user) {
        this.isLoggedIn = true;
        this.username = response.user.email;
        console.log('Usuario autenticado:', response.user);
      } else {
        this.isLoggedIn = false;
        console.log('Usuario no autenticado');
      }
      authFinalizado = true;
      comprobarCargaCompleta();
    },
    (error) => {
      console.error('Error al comprobar la autenticación', error);
      this.isLoggedIn = false;
      authFinalizado = true;
      this.error = true;
      comprobarCargaCompleta();
    }
  );

  // Llamada 2: Obtener vuelos
  this.Obtenervuelos(() => {
    vuelosFinalizado = true;
    comprobarCargaCompleta();
  });

  const navigation = history.state;
  if (navigation && navigation.successMessage) {
    this.successMessage = navigation.successMessage;
  }
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

  Obtenervuelos(callback: () => void) {
  this.vuelos_service.getVuelosAerolinea(this.id_aerolinea).subscribe(
    (response) => {
      console.log('Vuelos obtenidos exitosamente:', response);

      this.vuelos = [];
      this.vuelosFiltrados = [];

      for (let i = 0; i < response.contenido.length; i++) {
        const vuelo: Vuelo = {
          id: response.contenido[i].id,
          codigo: response.contenido[i].codigo_vuelo,
          origen: response.contenido[i].origen_pais,
          destino: response.contenido[i].destino_pais,
          hora: new Date(response.contenido[i].fecha_salida),
          estado: response.contenido[i].estado,
          origen_ciudad: response.contenido[i].aeropuerto_origen.municipality,
          destino_ciudad: response.contenido[i].aeropuerto_destino.municipality,

        };
        this.vuelos.push(vuelo);
      }

      this.vuelosFiltrados = [...this.vuelos];
      this.totalVuelos = this.vuelos.length;
      this.actualizarPaginacion();

      callback(); // ✅ indicar que finalizó
    },
    (error) => {
      console.error('Error al obtener los vuelos:', error);
      callback(); // ❗️ incluso si hay error, indicar que terminó
    }
  );
}


  // Filtra los vuelos en base a la búsqueda
  filtrarVuelos(event: any) {
    const texto = event.target.value.toLowerCase();
    this.vuelosFiltrados = this.vuelos.filter(vuelo =>
      vuelo.codigo.toLowerCase().includes(texto) ||
      vuelo.origen.toLowerCase().includes(texto) ||
      vuelo.destino.toLowerCase().includes(texto)
    );
    this.paginaActual = 1; // Reiniciar a la primera página después de filtrar
    this.actualizarPaginacion();
  }

  // Actualiza la lista de vuelos según la página actual
  actualizarPaginacion() {
    // Si no hay vuelos, totalPáginas debe ser 0
    if (this.vuelosFiltrados.length === 0) {
      this.totalPaginas = 0;
    } else {
      this.totalPaginas = Math.ceil(this.vuelosFiltrados.length / this.elementosPorPagina);
    }

    // Asegurarse de que paginaActual no exceda el número total de páginas
    if (this.paginaActual > this.totalPaginas && this.totalPaginas > 0) {
      this.paginaActual = this.totalPaginas;
    }

    // Establecer los vuelos para la página actual
    const inicio = (this.paginaActual - 1) * this.elementosPorPagina;
    const fin = inicio + this.elementosPorPagina;
    this.vuelosPaginados = this.vuelosFiltrados.slice(inicio, fin);
  }

  // Cambia a la página anterior
  paginaAnterior() {
    if (this.paginaActual > 1) {
      this.paginaActual--;
      this.actualizarPaginacion();
    }
  }

  // Cambia a la página siguiente
  paginaSiguiente() {
    if (this.paginaActual < this.totalPaginas) {
      this.paginaActual++;
      this.actualizarPaginacion();
    }
  }
}
