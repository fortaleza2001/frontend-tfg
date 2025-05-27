import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ChartConfiguration, ChartOptions, ChartType } from 'chart.js';
import Chart from 'chart.js/auto';
import {AerolineaService} from '../services/aerolinea.service';
import { Router } from '@angular/router'; 
import { environment } from '../../environments/environment';  // Importar el archivo de entorno
import { UserService } from '../services/user.service';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';


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
  isLoggedIn: boolean = false; // Cambia este valor según el estado de autenticación
  username: string = '';
  isLoading: boolean = true; // Controla el estado de carga
  menuOpen = false;
  menuAbierto = false;
  dropdownOpen = false;
  error = false;

  errorMensaje: string = '';

    toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

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
    private route: ActivatedRoute,
    private userService: UserService,
   
  ) {}

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
  volverHomeAerolinea() {
  if (this.aerolinea?.id) {
    this.router.navigate(['/aerolinea', this.aerolinea.id]);
  } else {
    console.warn('ID de aerolínea no disponible para navegar');
  }
}

   volverAlHome() {
    // Aquí puedes redirigir al home
    this.router.navigate(["/home"]);
  }

  irAerolineas()
  {
    this.router.navigate(["/Aerolineas-home"]);
  }


 


  ngOnInit(): void {
  const id = this.route.snapshot.paramMap.get('id');

  const auth$ = this.userService.checkAuthentication().pipe(
    catchError(error => {
      this.error=true;
      console.error('Error al comprobar autenticación', error);
      this.isLoggedIn = false;
      return of(null); // Evita que el forkJoin falle
    })
  );

  const aerolinea$ = this.aerolineaService.getAerolinea(id).pipe(
    catchError(error => {
      console.error('Error al obtener aerolínea', error);
      return of(null);
    })
  );

  forkJoin([auth$, aerolinea$]).subscribe(([authResp, aerolineaResp]) => {
    if (authResp?.user) {
      this.isLoggedIn = true;
      this.username = authResp.user.email;
    }

    if (aerolineaResp?.contenido) {
      console.log(aerolineaResp);
      const urlLogo = aerolineaResp.contenido.logoAerolinea
        ? `${this.$apiUrl}/storage/logos/${aerolineaResp.contenido.logoAerolinea}`
        : 'https://yourteachingmentor.com/wp-content/uploads/2020/12/istockphoto-1223671392-612x612-1.jpg';

      this.aerolinea = {
        id: aerolineaResp.contenido.id,
        nombreAerolinea: aerolineaResp.contenido.nombre,
        logoAerolinea: urlLogo,
        codigoIATA: aerolineaResp.contenido.codigo_AITA,
        direccionAerolinea: aerolineaResp.contenido.direccion,
        paisOrigen: aerolineaResp.contenido.pais,
        telefonoAerolinea: aerolineaResp.contenido.telefono,
      };
    }

    this.datosCargados = true;
    this.isLoading = false;
    this.createChart(); // solo cuando esté todo listo
  });
}

}
