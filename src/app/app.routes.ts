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
  { path: '', redirectTo: '/home', pathMatch: 'full' } // Redirección a home
];
