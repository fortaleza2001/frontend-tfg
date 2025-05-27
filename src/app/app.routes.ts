import { provideRouter, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { RegistroComponent } from './registro/registro.component';
import { HomeAerolineasComponent } from './home-aerolineas/home-aerolineas.component';
import { GestionVuelosComponent } from './gestion-vuelos/gestion-vuelos.component';
import { GestionAerolineasComponent } from './gestion-aerolineas/gestion-aerolineas.component';
import { CreateAirlineHomeComponent } from './create-airline-home/create-airline-home.component';
import { CreateAirlineComponent } from './create-airline/create-airline.component';
import { AerolineaPerfilComponent } from './aerolinea-perfil/aerolinea-perfil.component';
import { CrearVueloComponent } from './crear-vuelo/crear-vuelo.component';
import { RecuperarContraseñaComponent } from './formulario-recuperar-contrasena/formulario-recuperar-contrasena.component';
import {CambiarContrasenaComponent } from './cambiar-contrasena/cambiar-contrasena.component'
import {SoporteComponent } from './soporte/soporte.component'
import { FlightListComponent} from './flight-list/flight-list.component'
import { AerolineasTrabajoComponent} from './aerolineas-trabajo/aerolineas-trabajo.component'
import { PromocionesComponent} from './promociones/promociones.component'
import { ReservasComponent} from './reservas/reservas.component'
import {FlightDetailsComponent} from './flight-details/flight-details.component'
import {FlightBuyFormComponent} from './flight-buy-form/flight-buy-form.component'

import {ReservaDetalleComponent} from './reserva-detalle/reserva-detalle.component'

export const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'registro', component: RegistroComponent },
  { path: 'aerolinea/:id', component: HomeAerolineasComponent },

  { path: 'vuelos/:id', component: GestionVuelosComponent },
  { path: 'aerolineas', component: GestionAerolineasComponent },
  { path: 'Aerolineas-home', component: CreateAirlineHomeComponent },
  { path: 'Crear-Aerolineas', component: CreateAirlineComponent },
  { path: 'Aerolinea-perfil/:id', component: AerolineaPerfilComponent },
  { path: 'Crear-Vuelo/:id', component: CrearVueloComponent },
  { path: 'Formulario/Recuperar-password', component: RecuperarContraseñaComponent },
  { path: 'CambiarContraseña', component: CambiarContrasenaComponent },
  { path: 'Soporte', component: SoporteComponent },
  { path: 'buscar/vuelos', component: FlightListComponent },
  { path: 'aerolineas/trabajo', component: AerolineasTrabajoComponent },
  { path: 'reservas', component: ReservasComponent },
  { path: 'promociones', component: PromocionesComponent },
  { path: 'vuelo/:id', component: FlightDetailsComponent },
  { path: 'comprar/vuelo', component: FlightBuyFormComponent },
  { path: 'reservas/vuelo/:id', component: ReservaDetalleComponent },
  
  { path: '', redirectTo: '/home', pathMatch: 'full' } // Redirección a home
];
