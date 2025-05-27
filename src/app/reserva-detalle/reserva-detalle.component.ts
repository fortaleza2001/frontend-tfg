import { Component, OnInit, HostListener } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UserService } from '../services/user.service';
import { VuelosService } from '../services/vuelos.service';
import { FormBuilder, FormGroup,Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms'; // <-- AÑADE ESTO
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
  import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-reserva-detalle',
  imports: [CommonModule,FormsModule],
  templateUrl: './reserva-detalle.component.html',
  styleUrl: './reserva-detalle.component.css'
})
export class ReservaDetalleComponent implements OnInit {
  id_vuelo:any=0;
  datosCargados=false;
  isLoggedIn: boolean = false; // Cambia este valor según el estado de autenticación
  username: string = '';
  isLoading: boolean = true; // Controla el estado de carga
  menuOpen = false;
  menuAbierto = false;
  errorMensaje: string = '';
  error=false;
  devolucion =-1;
  reembolsoExitoso=false;
  constructor(
    private http: HttpClient, 
    private cookieService: CookieService,
    private router: Router,
    private userService: UserService,
    private fb: FormBuilder,
    private vuelosService:VuelosService,
    private route: ActivatedRoute
  ) {}
  dropdownOpen = false;
  vuelo = {
    nombre: 'Vuelo 123 a París',
    estado: 'Confirmado',
    ticketTypes: [] as any[]
  }
   isModalOpen: boolean = false;  // Controla si el modal está abierto o cerrado
  motivo: string = '';  // Almacena el motivo del reembolso

  // Método para abrir el modal
  openModal(id:any) {
    this.isModalOpen = true;
    this.devolucion = id;
    
  }

  // Método para cerrar el modal
  closeModal() {
    this.isModalOpen = false;
    this.motivo = '';  // Limpiar el motivo al cerrar
     this.devolucion = -1;
  }

  // Método para manejar el envío del formulario
  submitReembolso() {
    if (this.motivo.trim() !== '') {
      console.log('Solicitud de reembolso enviada con motivo:', this.motivo);

      this.vuelosService.DevolverTicket(this.devolucion,this.motivo).subscribe(
      (response:any) => {
        console.log(response);
        sessionStorage.setItem('reembolsoExitoso', 'true');
        window.location.reload();

        
      },
      (error) => {
        console.error(error);
    

      }
    );
      
      this.closeModal();  // Cerrar el modal después de enviar la solicitud
    }
  }


   // Función para solicitar reembolso
   solicitarRembolso() {
    
  }
  descargarFactura() {
    this.vuelosService.DescargarFactura(this.id_vuelo).subscribe(
      (response: Blob) => {
        // Creamos un objeto URL para el blob recibido
        const a = document.createElement('a');
        const url = window.URL.createObjectURL(response);
        a.href = url;
        a.download = 'ticket_vuelo.pdf'; // El nombre del archivo PDF
        a.click();
        window.URL.revokeObjectURL(url);  // Libera el objeto URL después de usarlo



      },
      (error) => {
        console.error(error);
    

      }
    );
  }
  volverAtras() {
    window.history.back();
  }
  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }
  descargarTicket(ticket: any) {
    this.vuelosService.DescargarTicket(ticket.id_reserva).subscribe(
      (response: Blob) => {
        // Creamos un objeto URL para el blob recibido
        const a = document.createElement('a');
        const url = window.URL.createObjectURL(response);
        a.href = url;
        a.download = 'ticket_vuelo.pdf'; // El nombre del archivo PDF
        a.click();
        window.URL.revokeObjectURL(url);  // Libera el objeto URL después de usarlo
      },
      (error) => {
        console.error(error);
    

      }
    );
  }
  


ngOnInit(): void {


    if (sessionStorage.getItem('reembolsoExitoso') === 'true') {
    this.reembolsoExitoso = true;
    sessionStorage.removeItem('reembolsoExitoso'); // Para que solo se vea una vez
  }
  this.id_vuelo = this.route.snapshot.paramMap.get('id');

  this.userService.checkAuthentication().subscribe(
    response => {
      if (response.user) {
        this.isLoggedIn = true;
        this.username = response.user.email;
        console.log('Usuario autenticado:', response.user);
      } else {
        this.isLoggedIn = false;
        console.log('Usuario no autenticado');
        this.error =true;
      }

      // Luego obtener reservas
      this.vuelosService.obtenerVueloReservaDetalle(this.id_vuelo).subscribe(
        reservaResponse => {
          let reservas = reservaResponse.reservas;
          this.vuelo.nombre = reservaResponse.salida.name + "→" + reservaResponse.vuelta.name;

          reservas.forEach((reserva: any) => {
            this.vuelo.ticketTypes.push({
              id_reserva: reserva.id,
              nombre: 'Clase ' + reserva.tipo,
              descripcion: 'Asiento en clase económica con comida incluida.',
              precio: reserva.precio,
              comprador: reserva.nombre_usuario,
              reembolsable: reserva.reembolsable == '0' ? false : true,
              id:reserva.id
            });
          });

          this.datosCargados = true;
          this.isLoading = false;
        },
        error => {
          console.error('Error al obtener detalles de reserva:', error);
          this.datosCargados = true;
          this.isLoading = false;
        }
      );
    },
    error => {
      console.error('Error al verificar autenticación:', error);
      this.isLoggedIn = false;
      this.datosCargados = true;
      this.isLoading = false;
      this.error =true;
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
    volverAlHome() {
    // Aquí puedes redirigir al home
    this.router.navigate(["/home"]);
  }

}
