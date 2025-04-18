import { Component,OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AerolineaService } from '../services/aerolinea.service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
@Component({
  selector: 'app-create-airline-home',
  imports: [CommonModule,FormsModule],
  templateUrl: './create-airline-home.component.html',
  styleUrl: './create-airline-home.component.css'
})
export class CreateAirlineHomeComponent implements OnInit {

  constructor(
    private http: HttpClient, 
    private aerolinearService: AerolineaService,
    private router: Router,
  ) {
    const nav = this.router.getCurrentNavigation();
    const message = nav?.extras.state?.['successMessage'];
    if (message) {
      // Mostrar el mensaje con un toast, alerta, etc.
      this.successMessage = message;
    }
  }
  successMessage: string | null = null;
  searchTerm: string = '';
  datosCargados=false;
  error =false;
  airlines:any[] = [
    
  ];
  
  ngOnInit(): void {
    this.aerolinearService.getAerolineaUsuario().subscribe(
      (response) => {
        console.log('Respuesta ', response);

        this.airlines = response.contenido.map((aerolinea: any) => ({
          id: aerolinea.id,
          nombre: aerolinea.nombre,
          pais: aerolinea.pais,
          codigoIATA: aerolinea.codigo_AITA
          || '', 
          verificado: aerolinea.confirmado ? '✅ Confirmada' : '⏳ En proceso' // puedes ajustar esto si quieres poner lógica
        }))
        
        this.datosCargados=true;
      },
      (error) => {
        console.error('Error ', error);
        this.error=true;
        this.datosCargados=true;
       
      }
      
    );

    
    
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
