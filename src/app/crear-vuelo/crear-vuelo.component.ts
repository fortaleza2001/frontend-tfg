import { Component,OnInit,ViewChild, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { VuelosService } from '../services/vuelos.service';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';

// Angular - modelo
export interface TicketDTO {
  tipo: string; // "Económico", "Business"
  precio: number;
  cantidadDisponible: number;
  equipajeIncluidoKg: number;
  reembolsable: boolean;
}


@Component({
  selector: 'app-crear-vuelo',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './crear-vuelo.component.html',
  styleUrls: ['./crear-vuelo.component.css']
})

export class CrearVueloComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private vuelos_Service : VuelosService
    
  ) {}
  id_aerolinea: any = '';
  tickets: TicketDTO[] = [
    
    
    
  ];
  mostrarModal: boolean = false; // Controla la visibilidad del modal
  errorCreacion: string | null = null;  
  fase: number = 1;
  logoPreview: string | ArrayBuffer | null = null;
  ticketEditando: TicketDTO | null = null;
indiceEditando: number = -1;
scrolledToError = false;
errores: string[] = [];
ticketsDisponibles: number = 0;

  vuelo:any={
    paisOrigen:"",
    aeropuesto_origen:"",
    terminal_origen:"",
    pais_destino:"",
    aeropuesto_destino:"",
    terminal_destino:"",
    fecha_salida: new Date(),
    fecha_llegada: new Date(),
    numero_tickets:"",
    numero_pasajeros:"",
  }



  nuevoTicket: TicketDTO = {
    tipo: '',
    precio: 0,
    cantidadDisponible: 0,
    equipajeIncluidoKg: 0,
    reembolsable: false
  };
  @ViewChild('errorContainer') errorContainer: any;  

  ngOnInit(): void {
    this.id_aerolinea = this.route.snapshot.paramMap.get('id');
  }

  get isTicketsEmpty() {
    return this.tickets.length === 0;
  }

  calcularTicketsDisponibles(indice:any): void 
  {
    if(indice==-1)
    {
      const total = Number(this.vuelo.numero_tickets);
      let asignados =0;
      for (let i = 0; i < this.tickets.length; i++) {
        asignados += Number(this.tickets[i].cantidadDisponible);
      }
      this.ticketsDisponibles = total - asignados;
    }
    else
    {
      const total = Number(this.vuelo.numero_tickets);
      let asignados =0;
      for (let i = 0; i < this.tickets.length; i++) {
        if(i!=indice)
        {
          asignados += Number(this.tickets[i].cantidadDisponible);
        }
        
      }
      this.ticketsDisponibles = total - asignados;
    }
   
  }
  


  editarTicket(index: number) {
    this.ticketEditando = { ...this.tickets[index] };
    this.indiceEditando = index;
    this.mostrarModal = true; // Reutilizas el modal de agregar
    this.nuevoTicket = this.ticketEditando;
    this.calcularTicketsDisponibles(index);
   
  }

  guardarTicket() {
   // Limpiar espacios y comparar en minúsculas para evitar conflictos como " Business " y "business"
const nombreSinEspacios = this.nuevoTicket.tipo.replace(/\s+/g, '').toLowerCase();
const nombreDuplicado = this.tickets.some((t, i) =>
  i !== this.indiceEditando && t.tipo.replace(/\s+/g, '').toLowerCase() === nombreSinEspacios
);

if (
  !this.nuevoTicket.tipo ||
  this.nuevoTicket.precio <= 0 ||
  this.nuevoTicket.cantidadDisponible <= 0
) {
  this.errorCreacion = 'Por favor, completa correctamente los datos del ticket.';
  return;
}
if (this.nuevoTicket.cantidadDisponible > this.ticketsDisponibles) {
  this.errorCreacion = `No puedes asignar más de ${this.ticketsDisponibles} tickets disponibles.`;
  return;
}

if (nombreDuplicado) {
  this.errorCreacion = 'Ya existe un ticket con ese tipo (ignorando espacios).';
  return;
}
    if (this.indiceEditando >= 0) {
      // Estamos editando
      this.tickets[this.indiceEditando] = { ...this.nuevoTicket };
    } else {
      // Estamos agregando uno nuevo
      this.tickets.push({ ...this.nuevoTicket });
    }
  
    this.ocultarPopup();
  
    this.nuevoTicket = {
      tipo: '',
      precio: 0,
      cantidadDisponible: 0,
      equipajeIncluidoKg: 0,
      reembolsable: false
    };
  
    this.indiceEditando = -1;
    this.ticketEditando = null;
    this.errorCreacion = null;
  }
  
  
    // Función para mostrar el modal
    mostrarPopup() {
      this.calcularTicketsDisponibles(-1);
      this.mostrarModal = true;
    }
  
    // Función para ocultar el modal
    ocultarPopup() {
      if(this.indiceEditando != -1)
        {
          this.indiceEditando = -1;
          this.ticketEditando = null;
         
          
          
        }

        this.nuevoTicket = {
          tipo: '',
          precio: 0,
          cantidadDisponible: 0,
          equipajeIncluidoKg: 0,
          reembolsable: false
        };

      this.mostrarModal = false;
      this.errorCreacion = null;
    }
  eliminarTicket(index: number) {
    this.tickets.splice(index, 1);
  }

  

  crearVuelo() {
    if(this.tickets.length==0)
    { this.errorCreacion = `No puedes Crear un vuelo sin asignar los tipos de billetes del vuelo.`;
      return;

    }
    console.log('Creando vuelo:', this.vuelo);
    this.vuelos_Service.postCrearVuelo(this.vuelo,this.id_aerolinea,this.tickets).subscribe(
      (response) => {
        console.log(response);
        this.router.navigate(
          ['/vuelos', this.id_aerolinea],
          { state: { successMessage: 'Vuelo Creado correctamente' } }
        );
        
      },
      (error) => {
        console.error('Error al crear el vuelo', error);
      }
    );
  }

  volverAtras() {
    history.back();
  }

subirFase() {
  this.errores = []; // Limpiar los errores al intentar subir la fase

  // Comprobaciones generales de campos
  const {
    paisOrigen, aeropuesto_origen, terminal_origen,
    pais_destino, aeropuesto_destino, terminal_destino,
    fecha_salida, fecha_destino,
    numero_vuelo, numero_tickets, numero_pasajeros
  } = this.vuelo;

  const ahora = new Date();

  // Validaciones de campos obligatorios
  if (!paisOrigen) this.errores.push('El país de origen es obligatorio.');
  if (!aeropuesto_origen) this.errores.push('El aeropuerto de origen es obligatorio.');
  if (!terminal_origen) this.errores.push('La terminal de origen es obligatoria.');

  if (!pais_destino) this.errores.push('El país de destino es obligatorio.');
  if (!aeropuesto_destino) this.errores.push('El aeropuerto de destino es obligatorio.');
  if (!terminal_destino) this.errores.push('La terminal de destino es obligatoria.');

  if (!fecha_salida) this.errores.push('La fecha de salida es obligatoria.');
  if (!fecha_destino) this.errores.push('La fecha de llegada es obligatoria.');

  if (numero_tickets == null) this.errores.push('El número de tickets es obligatorio.');
  if (numero_pasajeros == null) this.errores.push('El número de pasajeros es obligatorio.');

  // Validaciones lógicas de fechas
  const salida = new Date(fecha_salida);
  const llegada = new Date(fecha_destino);

  if (fecha_salida && salida < ahora) {
    this.errores.push('La fecha de salida debe ser posterior a la actual.');
  }

  if (fecha_destino && salida && llegada <= salida) {
    this.errores.push('La fecha de llegada debe ser posterior a la de salida.');
  }

  // Validación de capacidad
  if (numero_tickets >= numero_pasajeros) {
    this.errores.push('El número de tickets debe ser menor que el número de pasajeros.');
  }

  if ((numero_pasajeros - numero_tickets) < 5) {
    this.errores.push('Debe dejarse al menos un margen de 5 asientos para la tripulación.');
  }

  // Mostrar errores si existen
  if (this.errores.length > 0) {
    this.scrolledToError =false;
    this.errorCreacion = 'Corrige los siguientes errores:\n• ' + this.errores.join('\n• ');
    
  
  
    return;
  }

  this.errorCreacion = ''; // Limpiar errores si todo está correcto
  this.fase++; // Avanzar de fase
}


  bajarFase() {
    if (this.fase > 1) {
      this.fase--;
    }
  }

  scrollToError() {
    if (this.errorContainer) {
      this.errorContainer.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  ngAfterViewChecked() {
    // Este método se asegura de que el desplazamiento se realice después de que Angular haya actualizado el DOM.
    if (this.errorCreacion && this.errorContainer && this.scrolledToError ==false) {
      this.scrollToError();
      this.scrolledToError =true;
    }
  }

}
