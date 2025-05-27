import { Component, OnInit, HostListener } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UserService } from '../services/user.service';
import { FormsModule } from '@angular/forms';
import {VuelosService} from '../services/vuelos.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-flight-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './flight-list.component.html'
})
export class FlightListComponent implements OnInit {

  constructor(
    private http: HttpClient, 
    private cookieService: CookieService,
    private router: Router,
    private userService: UserService,
    private vuelosService: VuelosService,
    private route: ActivatedRoute
  ) {}
  paisOrigen = '';
  origen = '';
  paisDestino = '';
  destino = '';
  fechaSalida = '';
  pasajeros = 1;
  vuelos :any = [];
  
  

  // Filtros
  filtroOrigen: string = '';
  filtroDestino: string = '';
  filtroPrecio: number | null = null;

  // Paginación
  paginaActual = 1;
  vuelosPorPagina = 10;

  datosCargados=false;
  isLoggedIn: boolean = false; // Cambia este valor según el estado de autenticación
  username: string = '';
  isLoading: boolean = true; // Controla el estado de carga
  menuOpen = false;

  cantidades: number[][] = [];
  VuelosCargadas = false;
   authCargado = false;
camposInvalidos = false;
  setearFiltro()
  {
        // Obtener los parámetros de la URL
        this.route.queryParams.subscribe(params => {
          this.paisOrigen = params['paisOrigen'] || '';
          this.origen = params['origen'] || '';
          this.paisDestino = params['paisDestino'] || '';
          this.destino = params['destino'] || '';
          this.fechaSalida = params['fechaSalida'] || '';
          this.pasajeros = params['pasajeros'] || 1;
          
          // Aquí puedes hacer lo que desees con los parámetros obtenidos, como hacer una búsqueda
          console.log(this.paisOrigen, this.origen, this.paisDestino, this.destino, this.fechaSalida, this.pasajeros);
        });
  }

  enviar() {
  if (
    !this.paisOrigen ||
    !this.origen ||
    !this.paisDestino ||
    !this.destino ||
    !this.fechaSalida ||
    !this.pasajeros
  ) {
    this.camposInvalidos = true;
    return;
  }

  this.camposInvalidos = false;

  const queryParams = {
    paisOrigen: this.paisOrigen,
    origen: this.origen,
    paisDestino: this.paisDestino,
    destino: this.destino,
    fechaSalida: this.fechaSalida,
    pasajeros: this.pasajeros
  };

  this.router.navigate(['/buscar/vuelos'], { queryParams });
  // Si ya estás en la ruta, haz "navegación vacía" para forzar recarga
  if (this.router.url.startsWith('/buscar/vuelos')) {
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate(['/buscar/vuelos'], { queryParams });
    });
  } else {
    this.router.navigate(['/buscar/vuelos'], { queryParams });
  }
}

  buscarvuelos()
  {
    const busqueda = {
      paisOrigen: this.paisOrigen,
      origen: this.origen,
      paisDestino: this.paisDestino,
      destino: this.destino,
      fechaSalida: this.fechaSalida,
      pasajeros: this.pasajeros
    };

    this.vuelosService.postBuscar(busqueda).subscribe(
      (response) => {

        console.log( response);
        for( let i =0;i<response.coincidencias.length;i++)
        {
         

          let title = "Vuelo " + response.salidas[i].municipality + " → " + response.llegadas[i].municipality;
          let departureTime = response.coincidencias[i].fecha_salida;
          let arrivalTime = response.coincidencias[i].fecha_llegada;
          let departureAirport = "Aeropuerto " + response.salidas[i].name + " (" + response.salidas[i].iso_country + ")";
          let arrivalAirport = "Aeropuerto " + response.llegadas[i].name + " (" + response.llegadas[i].iso_country + ")";
          let description = response.coincidencias[i].description??"Disfruta de un vuelo directo con todas las comodidades desde "+response.salidas[i].municipality+" hasta la vibrante ciudad de "+response.llegadas[i].municipality +"."
      
          let origen = response.salidas[i].name + "(" + response.salidas[i].iso_country +")";
          let destino = response.llegadas[i].name + "(" + response.llegadas[i].iso_country +")";
          let tipos = [];
          for (let j = 0; j < response.billetes.length; j++) {
            let ticket: any = response.billetes[j];

              if(ticket.id_vuelo==response.coincidencias[i].id)
              {
                tipos.push({
                  nombre: ticket.tipo,
                  precio: ticket.precio,
                  disponibles:ticket.disponibles,
              });
              }
              
              
          }
          let vuelo = {
            title:title,
            departureTime:departureTime,
            arrivalTime:arrivalTime,
            departureAirport:departureAirport,
            arrivalAirport:arrivalAirport,
            description:description,
            origen: origen,
            destino: destino,
            fechaSalida: new Date(response.coincidencias[i].fecha_salida),
            fechaLlegada: new Date(response.coincidencias[i].fecha_llegada),
            tipos: tipos,
            id:response.coincidencias[i].id
          };
        
          this.vuelos.push(vuelo);
        }
        this.inicializarCantidades();
        this.VuelosCargadas = true;
        this.revisarCargaCompleta();

      },
      (error) => {
        console.error(error);
        this.VuelosCargadas = true;
        this.revisarCargaCompleta();
       
      }
    );
  } 

  inicializarCantidades() {
    this.cantidades = this.vuelos.map((vuelo:any) =>
      vuelo.tipos.map(() => 0)
    );
  }
  
  incrementarCantidad(i: number, j: number) {
    this.cantidades[i][j]++;
  }
  
  decrementarCantidad(i: number, j: number) {
    if (this.cantidades[i][j] > 0) {
      this.cantidades[i][j]--;
    }
  }
  
  comprarVuelo(i: number) {
    // Obtener el vuelo usando el índice 'i'
    const vuelo = this.vuelos[i];
    
    // Acceder a los tipos de billetes para ese vuelo
    const tiposBilletes = vuelo.tipos;
    
    // Imprimir los tipos de billetes y las cantidades en el log
    console.log('Tipos de billetes para el vuelo:', vuelo.origen, '->', vuelo.destino);
    
    tiposBilletes.forEach((tipo: { nombre: string; precio: number }, index: number) => {
      // Verificar que las cantidades estén disponibles para ese vuelo
      const cantidadDisponible = this.cantidades[i] ? this.cantidades[i][index] : 0; // Obtener la cantidad disponible de ese tipo de billete
      console.log(`Tipo de billete ${index + 1}: ${tipo.nombre} - Precio: ${tipo.precio} - Cantidad disponible: ${cantidadDisponible}`);
    });
  }
  
  
  
  
  dropdownOpen = false;

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }
 revisarCargaCompleta = () => {
    if (this.VuelosCargadas && this.authCargado) {
      this.datosCargados = true;
      this.isLoading = false;
    }
  };

  ngOnInit(): void {


    

    this.setearFiltro()
    
    this.buscarvuelos();
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
        this.authCargado = true;
        this.revisarCargaCompleta();
 

      },
      (error) => {
        console.error('Error al comprobar la autenticación', error);
        this.authCargado = true;
        this.revisarCargaCompleta();


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

  get vuelosFiltrados() {
    return this.vuelos.filter((v:any) =>
      (!this.filtroOrigen || v.origen.toLowerCase().includes(this.filtroOrigen.toLowerCase())) &&
      (!this.filtroDestino || v.destino.toLowerCase().includes(this.filtroDestino.toLowerCase())) &&
      (!this.filtroPrecio || Math.min(...v.tipos.map((t:any) => t.precio)) <= this.filtroPrecio)
    );
  }
  

  get totalPaginasFiltradas(): number {
    return Math.ceil(this.vuelosFiltrados.length / this.vuelosPorPagina);
  }

  get vuelosFiltradosPaginados() {
    const start = (this.paginaActual - 1) * this.vuelosPorPagina;
    return this.vuelosFiltrados.slice(start, start + this.vuelosPorPagina);
  }

  paginaAnterior() {
    if (this.paginaActual > 1) {
      this.paginaActual--;
      this.scrollAlInicio();
    }
  }
  
  paginaSiguiente() {
    if (this.paginaActual < this.totalPaginasFiltradas) {
      this.paginaActual++;
      this.scrollAlInicio();
    }
  }
  
  scrollAlInicio() {
    const lista = document.getElementById('lista-vuelos');
    if (lista) {
      lista.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  verVuelo(i: any) {
    console.log("hola");
  
    let id = this.vuelos[i].id;
    let currentRoute = this.router.url;
  
    this.router.navigate(['/vuelo', id], {
      queryParams: {
        previous: currentRoute
      }
    });
  }

   comprar(i:any) {

    // Obtener el vuelo usando el índice 'i'
    const vuelo = this.vuelos[i];
    
    // Acceder a los tipos de billetes para ese vuelo
    const tiposBilletes = vuelo.tipos;
    
    // Imprimir los tipos de billetes y las cantidades en el log
    console.log('Tipos de billetes para el vuelo:', vuelo.origen, '->', vuelo.destino);
    
    tiposBilletes.forEach((tipo: { nombre: string; precio: number }, index: number) => {
      // Verificar que las cantidades estén disponibles para ese vuelo
      const cantidadDisponible = this.cantidades[i] ? this.cantidades[i][index] : 0; // Obtener la cantidad disponible de ese tipo de billete
      console.log(`Tipo de billete ${index + 1}: ${tipo.nombre} - Precio: ${tipo.precio} - Cantidad disponible: ${cantidadDisponible}`);
    });



    const ticketTypes = tiposBilletes
  .map((tipo: { nombre: string; precio: number }, index: number) => {
    const cantidadDisponible = this.cantidades[i] ? this.cantidades[i][index] : 0;

    if (cantidadDisponible <= 0) return null;

   
    return {
      type: tipo.nombre,
      price: tipo.precio,
      quantity: cantidadDisponible
    };
  })
  .filter((item:any) => item !== null); // Eliminar los null (cantidad <= 0)


  console.log(ticketTypes);
    

    const seleccionados = ticketTypes;
  
    if (seleccionados.length === 0) {
      alert('Selecciona al menos un billete.');
      return;
    }
    const currentRoute = this.router.url;
    this.router.navigate(['/comprar/vuelo'], {
      queryParams: {
        flight: JSON.stringify({
          id: vuelo.id,
          title:vuelo.title ,
          departureTime: vuelo.departureTime,
          arrivalTime: vuelo.arrivalTime,
          departureAirport: vuelo.departureAirport,
          arrivalAirport: vuelo.arrivalAirport,
          description: vuelo.description
        }),
        tickets: JSON.stringify(seleccionados),
        previous: currentRoute

      }
    });
  }
  
}
