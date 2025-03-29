import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
// Definir la interfaz Vuelo
interface Vuelo {
  codigo: string;
  origen: string;
  destino: string;
  hora: string;
}

@Component({
  selector: 'app-gestion-vuelos',
  templateUrl: './gestion-vuelos.component.html',
  styleUrls: ['./gestion-vuelos.component.css'],
  imports: [CommonModule]
})
export class GestionVuelosComponent {
  // Array de vuelos con el tipo Vuelo
  vuelos: Vuelo[] = [
    { codigo: 'AV123', origen: 'Bogotá', destino: 'Madrid', hora: '10:30 AM' },
    { codigo: 'LA456', origen: 'Lima', destino: 'Miami', hora: '12:45 PM' },
    { codigo: 'IB789', origen: 'Madrid', destino: 'Buenos Aires', hora: '2:00 PM' },
    { codigo: 'AM101', origen: 'Ciudad de México', destino: 'Los Ángeles', hora: '3:15 PM' },
    { codigo: 'UA202', origen: 'Nueva York', destino: 'Londres', hora: '5:30 PM' },
    { codigo: 'AF303', origen: 'París', destino: 'Tokio', hora: '7:00 PM' },
    { codigo: 'BA404', origen: 'Londres', destino: 'Dubai', hora: '9:45 PM' }
  ];

  vuelosFiltrados: Vuelo[] = [...this.vuelos]; // Lista de vuelos filtrados
  vuelosPaginados: Vuelo[] = []; // Lista de vuelos en la página actual
  paginaActual = 1;
  elementosPorPagina = 5;
  totalPaginas = 1;

  constructor() {
    this.actualizarPaginacion();
  }

  // Filtra los vuelos en base a la búsqueda
  filtrarVuelos(event: any) {
    const texto = event.target.value.toLowerCase();
    this.vuelosFiltrados = this.vuelos.filter(vuelo =>
      vuelo.codigo.toLowerCase().includes(texto) ||
      vuelo.origen.toLowerCase().includes(texto) ||
      vuelo.destino.toLowerCase().includes(texto) ||
      vuelo.hora.toLowerCase().includes(texto)
    );
    this.paginaActual = 1; // Reiniciar a la primera página después de filtrar
    this.actualizarPaginacion();
  }

  // Actualiza la lista de vuelos según la página actual
  actualizarPaginacion() {
    if (!Array.isArray(this.vuelosFiltrados)) {
      console.error("vuelosFiltrados no es un array");
      return;
    }

    this.totalPaginas = Math.ceil(this.vuelosFiltrados.length / this.elementosPorPagina);
    // Asegurarse de que paginaActual no exceda el número total de páginas
    if (this.paginaActual > this.totalPaginas) {
      this.paginaActual = this.totalPaginas;
    }

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
