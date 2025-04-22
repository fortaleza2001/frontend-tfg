import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ChartConfiguration, ChartOptions, ChartType } from 'chart.js';
import Chart from 'chart.js/auto';
import {AerolineaService} from '../services/aerolinea.service';
import { Router } from '@angular/router'; 
import { environment } from '../../environments/environment';  // Importar el archivo de entorno

export interface Aerolinea {
  id?: string;
  nombreAerolinea: string;
  logoAerolinea: string;
  codigoIATA?: string;
  direccionAerolinea?: string;
  paisOrigen?: string;
  telefonoAerolinea? : string;
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
  private $apiUrl = environment.apiUrl;  // Uso consistente de $apiUrl
  datosCargados=false;

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
      options: {
        responsive: true,
        maintainAspectRatio: false, // Esto permite que el gráfico se estire para llenar el contenedor
        scales: {
          x: {
            ticks: {
              autoSkip: true,
              maxTicksLimit: 10
            }
          }
        }
      }
    });
  }
  

  constructor(
   
    private router: Router,
    private aerolineaService: AerolineaService,
    private route: ActivatedRoute
   
  ) {}

 
  obtenerAerolinea(id: any) {
    this.aerolineaService.getAerolinea(id).subscribe({
      next: (response) => {
        console.log(response);
  
        // Asumiendo que response.contenido.logo contiene el nombre del archivo del logo
        const urlLogo = response.contenido.logoAerolinea
  ? `${this.$apiUrl}/storage/logos/${response.contenido.logoAerolinea}`
  : 'https://yourteachingmentor.com/wp-content/uploads/2020/12/istockphoto-1223671392-612x612-1.jpg';

  
        this.aerolinea = {
          ...this.aerolinea,
          nombreAerolinea: response.contenido.nombre,
          logoAerolinea: urlLogo,
          codigoIATA:response.contenido.codigo_AITA,
          direccionAerolinea:response.contenido.direccion,
          paisOrigen:response.contenido.pais,
          telefonoAerolinea:response.contenido.telefono

        };
        this.datosCargados=true;
      },
      error: (error) => {
        console.error(error);
        this.datosCargados=true;
      }
    });
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
