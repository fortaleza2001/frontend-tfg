import { Component,OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AerolineaService } from '../services/aerolinea.service';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UserService } from '../services/user.service';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

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
    private route: ActivatedRoute,
    private userService: UserService,
   
  ) {}
  datosCargados=false;
  isLoggedIn: boolean = false; // Cambia este valor según el estado de autenticación
  username: string = '';
  isLoading: boolean = true; // Controla el estado de carga
  menuOpen = false;
  menuAbierto = false;
  errorMensaje: string = '';
  nombreAerolinea = "";
  id:any="";
  error =false;

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
 ngOnInit(): void {
  const id = this.route.snapshot.paramMap.get('id');
  this.id = id ? id : null;
  console.log('ID de la aerolínea:', id);

  let authFinalizado = false;
  let aerolineaFinalizado = false;

  const comprobarCargaCompleta = () => {
    if (authFinalizado && aerolineaFinalizado) {
      this.datosCargados = true;
      this.isLoading = false;
    }
  };

  // Autenticación
  this.userService.checkAuthentication().subscribe(
    (response) => {
      if (response.user) {
        this.isLoggedIn = true;
        this.username = response.user.email;
        console.log('Usuario autenticado:', response.user);
      } else {
        this.isLoggedIn = false;
        console.log('Usuario no autenticado');
      }
      authFinalizado = true;
      comprobarCargaCompleta();
    },
    (error) => {
      console.error('Error al comprobar la autenticación', error);
      this.isLoggedIn = false;
      this.error = true;
      authFinalizado = true;
      comprobarCargaCompleta();
    }
  );
  this.aerolineaService.getAerolinea(id).subscribe({
      next: (response) => {
        console.log( response);
        this.nombreAerolinea = response.contenido.nombre; 
       this.datosCargados=true;
        aerolineaFinalizado = true;
      comprobarCargaCompleta();
      },
      error: (error) => {
        console.error(error);
        this.datosCargados=true;
        aerolineaFinalizado = true;
      comprobarCargaCompleta();
        
      }
    })
  }


  volverAlHome() {
    // Aquí puedes redirigir al home
    this.router.navigate(["/home"]);
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
