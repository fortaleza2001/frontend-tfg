import { Component,OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import {AerolineaService} from '../services/aerolinea.service'
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';
@Component({
  selector: 'app-create-airline',
  templateUrl: './create-airline.component.html',
  styleUrls: ['./create-airline.component.css'],
  imports:[FormsModule,CommonModule]
})
export class CreateAirlineComponent implements OnInit {

  datosCargados=false;
  isLoggedIn: boolean = false; // Cambia este valor según el estado de autenticación
  username: string = '';
  isLoading: boolean = true; // Controla el estado de carga
  menuOpen = false;
  menuAbierto = false;
  errorMensaje: string = '';

  constructor(
    
    
    private router: Router,
    private aerolinea_Service : AerolineaService,
    private userService: UserService,

    
  ) {}

errorCreacion: string | null = null;  
  fase: number = 1;
  logoPreview: string | ArrayBuffer | null = null;
  aerolinea = {
    nombreCreador: '',
    dniCreador: '',
    direccionCreador: '',
    fechaNacimientoCreador: '',
    proteccionDatos: false,
    logoAerolinea: null as File | null,
    direccionAerolinea:"",
    codigoIATA:"",
    nombreAerolinea:"",
    paisOrigen:"",
    proteccionDatosPago: false,
    numeroTelefono: '',
    tituloAerolínea: '',
    nombreAerolínea: '',
    codigoAerolínea: '',
    direccionAerolínea: '',
    proteccionDatosAerolinea: false,
    prefijoTelefono:""
  };

  cuentaPago ={
    nombreTarjeta: '',
    numeroTarjeta:'',
    fechaCaducidad: '',
    cvv:''


  }
  dropdownOpen = false;
    error =false;


  ngOnInit(): void {
    this.userService.checkAuthentication().subscribe(
      (response) => {
        if (response.user) {
          this.isLoggedIn = true;
          this.username = response.user.email; // O usa otra propiedad del usuario que desees
          console.log('Usuario autenticado:', response.user);
        } else {
          this.isLoggedIn = false;
          console.log('Usuario no autenticado');
        }
        this.isLoading = false;
        this.datosCargados=true;

      },
      (error) => {
        console.error('Error al comprobar la autenticación', error);
        this.isLoggedIn = false;
        this.isLoading = false;
        this.datosCargados=true;
        this.error = true;

      }
    );
  }
 volverAlHome() {
    // Aquí puedes redirigir al home
    this.router.navigate(["/home"]);
  }
  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

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

  crearAerolinea()
  {
    if (
      !this.aerolinea.nombreAerolinea?.trim() ||
      !this.aerolinea.direccionAerolinea?.trim() ||
      !this.aerolinea.codigoIATA?.trim() ||
      !this.aerolinea.paisOrigen?.trim()
    ) {
      this.errorCreacion = 'Por favor, completa todos los campos obligatorios de la Fase 3.';
      return;
    }


    this.aerolinea_Service.PostCrearAerolinea(this.aerolinea,this.cuentaPago).subscribe(
      (response) => {
       console.log(response);
       this.router.navigate(["Aerolineas-home"], {
        state: { successMessage: 'Aerolínea creada correctamente en proceso para su verificación' }
      });
      },
      (error) => {
        console.error(error);
        if (error.status === 409 && error.error.errors) {
          this.errorCreacion = error.error.errors;
        } else {
          this.errorCreacion = 'Ocurrió un error inesperado.';
        }
      }
    );
  }

  onLogoSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      this.aerolinea.logoAerolinea = file;
  
      const reader = new FileReader();
      reader.onload = () => {
        this.logoPreview = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }

  // Método para cambiar la fase
  subirFase() {

    if (this.fase === 1) {
      const dniPattern = /^\d{8}[A-Za-z]$/;
      const telefonoPattern = /^\d{9}$/;
      const nombrePattern = /^[a-zA-ZÁÉÍÓÚÑáéíóúñ\s]{3,}$/;
      const direccionPattern = /^.{5,}$/;
    
      let errorMessages: string[] = [];
    
      if (!this.aerolinea.nombreCreador?.trim() || !nombrePattern.test(this.aerolinea.nombreCreador)) {
        errorMessages.push('El nombre del creador es obligatorio y debe tener al menos 3 letras.');
      }
    
      if (!this.aerolinea.dniCreador?.trim() || !dniPattern.test(this.aerolinea.dniCreador)) {
        errorMessages.push('El DNI debe tener 8 números seguidos de una letra (ej. 12345678A).');
      }
    
      if (!this.aerolinea.direccionCreador?.trim() || !direccionPattern.test(this.aerolinea.direccionCreador)) {
        errorMessages.push('La dirección debe tener al menos 5 caracteres.');
      }
    
      if (!this.aerolinea.numeroTelefono?.trim() || !telefonoPattern.test(this.aerolinea.numeroTelefono)) {
        errorMessages.push('El número de teléfono debe tener exactamente 9 dígitos.');
      }
    
      if (!this.aerolinea.fechaNacimientoCreador) {
        errorMessages.push('La fecha de nacimiento es obligatoria.');
      }
    
      if (!this.aerolinea.proteccionDatos) {
        errorMessages.push('Debes aceptar la política de protección de datos.');
      }
    
      // Si hay errores, se los asignamos a errorCreacion
      if (errorMessages.length > 0) {
        this.errorCreacion = errorMessages.join(' ');
        return;
      }
    }
    
    if (this.fase === 2) {
      if (
        !this.cuentaPago.nombreTarjeta?.trim() ||
        !this.cuentaPago.numeroTarjeta?.trim() ||
        !this.cuentaPago.fechaCaducidad ||
        !this.cuentaPago.cvv?.trim()
      ) {
        this.errorCreacion = 'Por favor, completa todos los campos obligatorios de la Fase 2.';
        return;
      }
    }

    this.errorCreacion = ''; // Limpiar error si todo está bien
    this.fase++;
  }

  bajarFase() {
    if (this.fase > 1) {
      this.fase--;
    }
  }

  volverAtras() {
    this.router.navigate(["/Aerolineas-home"])
  }

  
}
