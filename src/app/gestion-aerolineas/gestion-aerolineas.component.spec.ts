import { Component } from '@angular/core';

interface Airline {
  id: number;
  name: string;
  image: string;
}

@Component({
  selector: 'app-gestion-aerolineas',
  templateUrl: './gestion-aerolineas.component.html',
  styleUrls: ['./gestion-aerolineas.component.css']
})
export class GestionAerolineasComponent {
  airlines: Airline[] = [
    { id: 1, name: 'Aerolínea A', image: 'https://via.placeholder.com/250' },
    { id: 2, name: 'Aerolínea B', image: 'https://via.placeholder.com/250' }
  ];

  createAirline() {
    const newId = this.airlines.length + 1;
    this.airlines.push({
      id: newId,
      name: `Aerolínea ${newId}`,
      image: 'https://via.placeholder.com/250'
    });
  }

  modifyAirline(id: number) {
    alert(`Modificar aerolínea con ID ${id}`);
  }

  administerAirline(id: number) {
    alert(`Administrar aerolínea con ID ${id}`);
  }
}