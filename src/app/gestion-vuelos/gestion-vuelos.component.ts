import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VuelosService } from '../services/vuelos.service';
import { ActivatedRoute } from '@angular/router';

// Definir la interfaz Vuelo
interface Vuelo {
  codigo: string;
  origen: string;
  destino: string;
  hora: Date;
  estado: string;  // Agregado estado para los vuelos
}

@Component({
  selector: 'app-gestion-vuelos',
  templateUrl: './gestion-vuelos.component.html',
  styleUrls: ['./gestion-vuelos.component.css'],
  imports: [CommonModule]
})
export class GestionVuelosComponent implements OnInit {
  constructor(private vuelos_service: VuelosService, private route: ActivatedRoute) {}

  datosCargados=false;
  id_aerolinea: any = '';
  vuelos: Vuelo[] = []; // Lista de vuelos desde la API
  vuelosFiltrados: Vuelo[] = []; // Lista de vuelos filtrados
  vuelosPaginados: Vuelo[] = []; // Lista de vuelos en la página actual
  paginaActual = 1;
  elementosPorPagina = 5;
  totalPaginas = 1;
  totalVuelos: number = 0; // Total de vuelos

  ngOnInit(): void {
    this.id_aerolinea = this.route.snapshot.paramMap.get('id');
    this.Obtenervuelos();
  }

  Obtenervuelos() {
    this.vuelos_service.getVuelosAerolinea(this.id_aerolinea).subscribe(
      (response) => {
        console.log('Vuelos obtenidos exitosamente:', response);
        
        // Resetear las listas antes de agregar los nuevos vuelos
        this.vuelos = [];
        this.vuelosFiltrados = [];

        // Asignar los vuelos a la lista de vuelos
        let vuelo: Vuelo;
        for (let i = 0; i < response.contenido.length; i++) {
          vuelo = {
            codigo: response.contenido[i].codigo_vuelo,
            origen: response.contenido[i].origen_pais,  // Asegúrate de que estos campos estén en la respuesta
            destino: response.contenido[i].destino_pais, // Asegúrate de que estos campos estén en la respuesta
            hora: new Date(response.contenido[i].fecha_salida),  // Asegúrate de que el formato de fecha sea correcto
            estado: response.contenido[i].estado  // Asegúrate de que este campo esté presente en la respuesta
          };

          // Agregar el vuelo a la lista de vuelos
          this.vuelos.push(vuelo);
        }

        // Copiar los vuelos a vuelosFiltrados para mantener sincronizadas las listas
        this.vuelosFiltrados = [...this.vuelos];

        // Actualizar el total de vuelos y paginación
        this.totalVuelos = this.vuelos.length;
        this.actualizarPaginacion();
        this.datosCargados=true;
      },
      (error) => {
        console.error('Error al obtener los vuelos:', error);
        this.datosCargados=true;
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
