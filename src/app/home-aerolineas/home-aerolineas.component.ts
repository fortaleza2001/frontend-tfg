import { Component,OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AerolineaService } from '../services/aerolinea.service';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home-aerolineas',
  imports: [CommonModule],
  templateUrl: './home-aerolineas.component.html',
  styleUrl: './home-aerolineas.component.css'
})
export class HomeAerolineasComponent implements OnInit {

  constructor(
   
    private router: Router,
    private aerolineaService: AerolineaService,
    private route: ActivatedRoute
   
  ) {}

  datosCargados=false;
  nombreAerolinea = "";
  id:any="";
  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.id = id ? id : null;

    console.log('ID de la aerolínea:', id);
    this.obtenerAerolinea(id);
  }

  obtenerAerolinea(id:any){
    this.aerolineaService.getAerolinea(id).subscribe({
      next: (response) => {
        console.log( response);
        this.nombreAerolinea = response.contenido.nombre; 
       this.datosCargados=true;
      },
      error: (error) => {
        console.error(error);
        this.datosCargados=true;
        
      }
    })
  }

  volverHome() {
    this.router.navigate(['/home']); // Cambia '/ruta-deseada' por la ruta que deseas
  }
  volverHomeAerolineas() {
    this.router.navigate(['/Aerolineas-home']); // Cambia '/ruta-deseada' por la ruta que deseas
  }

}
