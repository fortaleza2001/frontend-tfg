import { Component,OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AerolineaService } from '../services/aerolinea.service';
import { UserService } from '../services/user.service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';
@Component({
  selector: 'app-create-airline-home',
  imports: [CommonModule,FormsModule],
  templateUrl: './create-airline-home.component.html',
  styleUrl: './create-airline-home.component.css'
})
export class CreateAirlineHomeComponent implements OnInit {

    datosCargados=false;
  isLoggedIn: boolean = false; // Cambia este valor según el estado de autenticación
  username: string = '';
  isLoading: boolean = true; // Controla el estado de carga
  menuOpen = false;
  menuAbierto = false;
  errorMensaje: string = '';

  constructor(
    private http: HttpClient, 
    private aerolinearService: AerolineaService,
    private router: Router,
    private userService: UserService,
  ) {
    const nav = this.router.getCurrentNavigation();
    const message = nav?.extras.state?.['successMessage'];
    if (message) {
      // Mostrar el mensaje con un toast, alerta, etc.
      this.successMessage = message;
    }
  }
   dropdownOpen = false;

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

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }
  successMessage: string | null = null;
  searchTerm: string = '';
  error =false;
  airlines:any[] = [
    
  ];
  


ngOnInit(): void {
  this.isLoading = true;
  this.datosCargados = false;

  const auth$ = this.userService.checkAuthentication();
  const airlines$ = this.aerolinearService.getAerolineaUsuario();

  forkJoin([auth$, airlines$]).subscribe({
    next: ([authResponse, airlinesResponse]) => {
      // Procesar autenticación
      if (authResponse.user) {
        this.isLoggedIn = true;
        this.username = authResponse.user.email;
        console.log('Usuario autenticado:', authResponse.user);
      } else {
        this.isLoggedIn = false;
        console.log('Usuario no autenticado');
      }

      // Procesar aerolíneas
      console.log('Respuesta ', airlinesResponse);
      this.airlines = airlinesResponse.contenido.map((aerolinea: any) => ({
        id: aerolinea.id,
        nombre: aerolinea.nombre,
        pais: aerolinea.pais,
        codigoIATA: aerolinea.codigo_AITA || '',
        verificado: aerolinea.confirmado ? '✅ Confirmada' : '⏳ En proceso'
      }));

      this.datosCargados = true;
      this.isLoading = false;
    },
    error: (error) => {
      console.error('Error al cargar datos', error);
      this.isLoggedIn = false;
      this.error = true;
      this.datosCargados = true;
      this.isLoading = false;
    }
  });
}


  get filteredAirlines() {
    const term = this.searchTerm.toLowerCase();
    return this.airlines.filter(
      airline =>
        airline.nombre.toLowerCase().includes(term) ||
        airline.pais.toLowerCase().includes(term) ||
        airline.codigoIATA.toLowerCase().includes(term)
    );
  }

  gestionarAerolinea(aerolinea: any) {
    console.log('Gestionando aerolínea:', aerolinea);
    // Aquí puedes redirigir a otra página o abrir un modal
    // this.router.navigate(['/aerolinea', aerolinea.codigoIATA]);
  }
  
  volverAlHome() {
    // Aquí puedes redirigir al home
    this.router.navigate(["/home"]);
  }

  ircrearAerolinea() {
    this.router.navigate(["/Crear-Aerolineas"]);
  }

  irAerolinea(id: any) {
    this.router.navigate([`/aerolinea`, id]);
  }
  
}
