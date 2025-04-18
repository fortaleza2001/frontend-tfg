import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ChartConfiguration, ChartOptions, ChartType } from 'chart.js';
import Chart from 'chart.js/auto';
import {AerolineaService} from '../services/aerolinea.service';
import { Router } from '@angular/router'; 

interface Aerolinea {
  id: string;
  nombreAerolinea: string;
  codigoIATA: string;
  direccionAerolinea: string;
  paisOrigen: string;
  logoAerolinea?: string;
}

@Component({
  selector: 'app-aerolinea-perfil',
  templateUrl: './aerolinea-perfil.component.html',
  styleUrls: ['./aerolinea-perfil.component.css'],
  standalone: true,
  imports: [CommonModule,]
})
export class AerolineaPerfilComponent implements OnInit {
  aerolinea: Aerolinea | null = null;
  public lineChart: any;
  // Datos falsos para simular la aerolínea
  fakeAerolinea: Aerolinea = {
    id: '1',
    nombreAerolinea: 'Aerolínea Ficticia',
    codigoIATA: 'AF123',
    direccionAerolinea: 'Calle Ficticia 123, Ciudad Imaginaria',
    paisOrigen: 'Imaginaria',
    logoAerolinea: 'https://via.placeholder.com/150'
  };

  createChart() {
    this.lineChart = new Chart('lineChart', {
      type: 'line',
      data: {
        labels: ['jan', 'feb', 'mar', 'april', 'may', 'june', 'july', 'aug'],
        datasets: [
          {
            label: 'My First Dataset',
            data: [65, 59, 80, 81, 56, 55, 40],
            fill: false,
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.1,
          },
        ],
      },
    });
  }


  constructor(
   
    private router: Router,
    private aerolineaService: AerolineaService,
    private route: ActivatedRoute
   
  ) {}

 
  obtenerAerolinea(id:any){
    this.aerolineaService.getAerolinea(id).subscribe({
      next: (response) => {
        console.log( response);
  
      },
      error: (error) => {
        console.error(error);
     
        
      }
    })
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.obtenerAerolinea(id);
    this.createChart();
  
      this.aerolinea = {
        id: id || '0',
        nombreAerolinea: 'Aerolínea Desconocida',
        codigoIATA: 'XX000',
        direccionAerolinea: 'Dirección no disponible',
        paisOrigen: 'Desconocido',
        logoAerolinea: 'https://via.placeholder.com/150'
      };
    
  }
}
