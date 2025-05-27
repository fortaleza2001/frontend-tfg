import { Component, OnInit, HostListener } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UserService } from '../services/user.service';
import { VuelosService } from '../services/vuelos.service';
import { FormBuilder, FormGroup,Validators,FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms'; // <-- AÑADE ESTO
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
@Component({
  selector: 'app-flight-details',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './flight-details.component.html'
})
export class FlightDetailsComponent implements OnInit {


  constructor(
    private http: HttpClient, 
    private cookieService: CookieService,
    private router: Router,
    private userService: UserService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private vuelosService: VuelosService,
    private location: Location
  ) {}

  datosCargados=false;
  isLoggedIn: boolean = false; // Cambia este valor según el estado de autenticación
  username: string = '';
  isLoading: boolean = true; // Controla el estado de carga
  menuOpen = false;
  menuAbierto = false;
  errorMensaje: string = '';
  regreso = false;
  flight : any = {
    id:"",
    title: 'Vuelo Madrid → Nueva York',
    description: 'Disfruta de un vuelo directo con todas las comodidades desde Madrid hasta la vibrante ciudad de Nueva York.',
    imageUrl: 'https://imagenes.20minutos.es/files/image_990_556/uploads/imagenes/2022/03/01/istock-955952680.jpeg',
    departureTime: '2025-05-10T08:30:00',
    arrivalTime: '2025-05-10T13:45:00',
    departureAirport: 'Aeropuerto Adolfo Suárez Madrid-Barajas (MAD)',
    arrivalAirport: 'Aeropuerto Internacional JFK (JFK)',
    ticketTypes: [
      {
        type: 'Económico',
        price: 350,
        description: 'Asiento estándar, comida incluida, equipaje de mano.',
        quantity: 0
      },
      {
        type: 'Business',
        price: 850,
        description: 'Mayor comodidad, menú gourmet, acceso a sala VIP.',
        quantity: 0
      },
      {
        type: 'Primera Clase',
        price: 1200,
        description: 'Asiento cama, servicio exclusivo, máxima privacidad.',
        quantity: 0
      }
    ]
  };
  
  dropdownOpen = false;


  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  obtenerVuelo()
  {
    this.vuelosService.obtenerVuelo(this.flight.id).subscribe(
      (response) => {
       console.log(response);
       this.flight.title = "Vuelo " + response.ida.municipality + " → " + response.llegada.municipality;
       this.flight.departureTime = response.vuelo.fecha_salida;
       this.flight.arrivalTime = response.vuelo.fecha_llegada;
       this.flight.departureAirport ="Aeropuerto " + response.ida.name + " (" + response.ida.iso_country + ")";
       this.flight.arrivalAirport ="Aeropuerto " + response.llegada.name + " (" + response.llegada.iso_country + ")";
       this.flight.description = response.vuelo.description??"Disfruta de un vuelo directo con todas las comodidades desde "+response.ida.municipality+" hasta la vibrante ciudad de "+response.llegada.municipality +"."
       let tickets = [];
       for (let x = 0; x < response.billetes.length; x++) {
        tickets.push({
          type: response.billetes[x].tipo,
          price: response.billetes[x].precio,
          description: response.billetes[x].descripcion ?? 'Asiento estándar, comida incluida, equipaje de mano.',
          quantity: 0,
          disponibles:response.billetes[x].disponibles
        });
      }
      

       this.flight.ticketTypes = tickets;

      },
      (error) => {
        console.error('Error al comprobar la autenticación', error);
       

      }
    );


  }

  ngOnInit(): void {
  this.flight.id = this.route.snapshot.paramMap.get('id');

  let vueloCargado = false;
  let authCargado = false;

  const checkFinalizado = () => {
    if (vueloCargado && authCargado) {
      this.isLoading = false;
      this.datosCargados = true;
    }
  };

  // Obtener datos del vuelo
  this.vuelosService.obtenerVuelo(this.flight.id).subscribe(
    (response) => {
      this.flight.title = "Vuelo " + response.ida.municipality + " → " + response.llegada.municipality;
      this.flight.departureTime = response.vuelo.fecha_salida;
      this.flight.arrivalTime = response.vuelo.fecha_llegada;
      this.flight.departureAirport = "Aeropuerto " + response.ida.name + " (" + response.ida.iso_country + ")";
      this.flight.arrivalAirport = "Aeropuerto " + response.llegada.name + " (" + response.llegada.iso_country + ")";
      this.flight.description = response.vuelo.description ?? `Disfruta de un vuelo directo con todas las comodidades desde ${response.ida.municipality} hasta la vibrante ciudad de ${response.llegada.municipality}.`;

      this.flight.ticketTypes = response.billetes.map((b: any) => ({
        type: b.tipo,
        price: b.precio,
        description: b.descripcion ?? 'Asiento estándar, comida incluida, equipaje de mano.',
        quantity: 0,
        disponibles: b.disponibles
      }));

      vueloCargado = true;
      checkFinalizado();
    },
    (error) => {
      console.error('Error al cargar el vuelo', error);
      vueloCargado = true; // Aunque haya error, marcamos como finalizado
      checkFinalizado();
    }
  );

  // Comprobar autenticación
  this.userService.checkAuthentication().subscribe(
    (response) => {
      if (response.user) {
        this.isLoggedIn = true;
        this.username = response.user.email;
      } else {
        this.isLoggedIn = false;
      }
      authCargado = true;
      checkFinalizado();
    },
    (error) => {
      console.error('Error al comprobar la autenticación', error);
      this.isLoggedIn = false;
      authCargado = true;
      checkFinalizado();
    }
  );
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


  getSubtotal(ticket: any): number {
    return ticket.price * ticket.quantity;
  }

  get total(): number {
    return this.flight.ticketTypes.reduce(
      (sum:number, ticket:any) => sum + this.getSubtotal(ticket), 0
    );
  }

  comprar() {
    const seleccionados = this.flight.ticketTypes.filter((t:any) => t.quantity > 0);
  
    if (seleccionados.length === 0) {
      alert('Selecciona al menos un billete.');
      return;
    }
    const currentRoute = this.router.url;
    this.router.navigate(['/comprar/vuelo'], {
      queryParams: {
        flight: JSON.stringify({
          id: this.flight.id,
          title: this.flight.title,
          departureTime: this.flight.departureTime,
          arrivalTime: this.flight.arrivalTime,
          departureAirport: this.flight.departureAirport,
          arrivalAirport: this.flight.arrivalAirport,
          description: this.flight.description
        }),
        tickets: JSON.stringify(seleccionados),
        previous: currentRoute

      }
    });
  }

  volver()
  {
    const previous = this.route.snapshot.queryParamMap.get('previous');
      if (previous) {
        this.router.navigateByUrl(previous);
      } else {
        this.router.navigate(['/']);
      }
    
    
  }
}
