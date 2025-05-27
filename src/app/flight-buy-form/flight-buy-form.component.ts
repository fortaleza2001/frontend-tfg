import { Component, OnInit,ViewChild, HostListener } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UserService } from '../services/user.service';
import { VuelosService } from '../services/vuelos.service';
import { FormBuilder, FormGroup,Validators,FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms'; // <-- AÑADE ESTO

@Component({
  selector: 'app-flight-buy-form',
  imports: [CommonModule,ReactiveFormsModule,FormsModule],
  templateUrl: './flight-buy-form.component.html',
  styleUrl: './flight-buy-form.component.css'
})
export class FlightBuyFormComponent implements OnInit {
  datosCargados=false;
  isLoggedIn: boolean = false; // Cambia este valor según el estado de autenticación
  username: string = '';
  isLoading: boolean = true; // Controla el estado de carga
  menuOpen = false;
  menuAbierto = false;
  errorMensaje: string = '';
  fase: number = 1;
  errorCreacion: string | null = null;
  constructor(
    private http: HttpClient, 
    private cookieService: CookieService,
    private router: Router,
    private userService: UserService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private vuelosService:VuelosService
  ) {}
  dropdownOpen = false;
  precioPorBillete = 50; // o el valor que desee
  vuelo: any;
  tickets: any[] = [];
  pago = {
    nombreTitular: '',
    numeroTarjeta: '',
    expiracion: '',
    cvv: '',
    precioTotal:0,
  };
  billetes:any = [

  ];
  @ViewChild('errorContainer') errorContainer: any;  

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  ngOnInit(): void {

    this.route.queryParams.subscribe(params => {
      if (params['flight'] && params['tickets']) {
        try {
          this.vuelo = JSON.parse(params['flight']);
          this.tickets = JSON.parse(params['tickets']);
          this.billetes = [];
          let n =-1;

          for (const ticket of this.tickets) {
            n++;
            for (let i = 0; i < ticket.quantity; i++) {
              this.pago.precioTotal=  this.pago.precioTotal +  Number(ticket.price);
              console.log(this.pago.precioTotal);
              this.billetes.push({nombre: '', dni: '', direccion: '',title :ticket.type, type_index:n, });
            }
          }

        } catch (e) {
          console.error('Error al parsear parámetros:', e);
          this.router.navigate(['/']); // Redirige si hay error
        }
      } else {
        // Si faltan datos, redirige o muestra mensaje de error
        this.router.navigate(['/']);
      }
    });


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

      }
    );
  }

  irfase2(): void {
    const errores: string[] = [];
  
    for (let i = 0; i < this.billetes.length; i++) {
      const billete = this.billetes[i];
  
      if (!billete.nombre || !billete.dni || !billete.direccion) {
        errores.push(`Pasajero ${i + 1}: todos los campos son obligatorios.`);
      } else {
        const dniValido = /^\d{8}[A-Za-z]$/.test(billete.dni);
        if (!dniValido) {
          errores.push(`Pasajero ${i + 1}: el DNI no es válido (formato correcto: 12345678A).`);
        }
      }
    }
  
    if (errores.length > 0) {
      this.errorMensaje = errores.join('\n');
      this.errorCreacion = this.errorMensaje;
      
      // Hacer scroll al contenedor del error
      setTimeout(() => {
        this.errorContainer?.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 0);
      
      return;
    }
  
    // Si no hay errores, avanzamos de fase
    this.errorCreacion = '';
    this.fase++;
  }
  

  comprar(): void {
    const errores: string[] = [];
  
    if (!this.pago.nombreTitular.trim()) {
      errores.push('El nombre del titular es obligatorio.');
    }
  
    if (!/^\d{16}$/.test(this.pago.numeroTarjeta)) {
      errores.push('El número de tarjeta debe tener 16 dígitos.');
    }
  
    if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(this.pago.expiracion)) {
      errores.push('La fecha de expiración debe tener el formato MM/AA.');
    }
  
    if (!/^\d{3}$/.test(this.pago.cvv)) {
      errores.push('El CVV debe tener 3 dígitos.');
    }
  
    if (errores.length > 0) {
      this.errorMensaje = errores.join('\n');
      this.errorCreacion = this.errorMensaje;
  
      setTimeout(() => {
        this.errorContainer?.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 0);
  
      return;
    }
  
    // Si no hay errores, limpiamos errores previos y avanzamos o enviamos datos
    this.errorCreacion = '';
    this.errorMensaje = '';
  
    // Aquí puedes continuar con la compra (por ejemplo, enviar datos al backend)
    console.log('Compra realizada con éxito', this.pago);
    alert('Compra realizada con éxito'+ this.pago);
    this.vuelosService.ComprarPedido(this.vuelo, this.tickets, this.billetes,this.pago).subscribe({
      next: (respuesta) => {
        // Aquí manejas la respuesta de la API si la compra fue exitosa
        console.log('Compra realizada con éxito:', respuesta);
        // Redirigir o mostrar mensaje de éxito, según sea necesario
        this.router.navigate(["reservas"]);
      },
      error: (error) => {
        // Aquí manejas el error si la compra falla
        console.error('Error al realizar la compra:', error);
        this.errorMensaje = 'Hubo un error al procesar la compra. Por favor, intenta nuevamente.';
        this.errorContainer?.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
    
    
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
  volverAtras() {
    const previous = this.route.snapshot.queryParamMap.get('previous');
    if (previous) {
      this.router.navigateByUrl(previous);
    } else {
      this.router.navigate(['/']); // fallback
    }
  }
}
