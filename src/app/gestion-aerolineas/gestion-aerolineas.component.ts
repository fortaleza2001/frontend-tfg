import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
@Component({
  selector: 'app-gestion-aerolineas',
  templateUrl: './gestion-aerolineas.component.html',
  styleUrls: ['./gestion-aerolineas.component.css'],
  imports:[CommonModule,FormsModule]
})
export class GestionAerolineasComponent {

  
  constructor(private router: Router) {}
  airlines = [
    { id: 1, name: 'Aerolínea A', image: 'path/to/image1.jpg' },
    { id: 2, name: 'Aerolínea B', image: 'path/to/image2.jpg' },
    { id: 3, name: 'Aerolínea C', image: 'path/to/image3.jpg' },
    // Más aerolíneas...
  ];

  filteredAirlines = [...this.airlines];  // Inicialmente muestra todas las aerolíneas.
  searchQuery: string = '';

  createAirline() {
    // Lógica para crear una aerolínea
  }

  modifyAirline(id: number) {
    // Lógica para modificar una aerolínea
  }

  administerAirline(id: number) {
    // Lógica para administrar una aerolínea
  }

  searchAirlines() {
    const normalizedQuery = this.normalizeString(this.searchQuery);  // Normaliza la consulta de búsqueda
    this.filteredAirlines = this.airlines.filter(airline =>
      this.normalizeString(airline.name).includes(normalizedQuery)
    );
  }
  
  // Función para normalizar cadenas eliminando acentos y pasando a minúsculas
  normalizeString(str: string): string {
    return str
      .toLowerCase()                               // Convierte a minúsculas
      .normalize("NFD")                             // Descompone caracteres acentuados
      .replace(/[\u0300-\u036f]/g, "");             // Elimina los acentos
  }
  goBack() {
    this.router.navigate(['/home']); // Cambia '/ruta-deseada' por la ruta que deseas
  }
  
}
