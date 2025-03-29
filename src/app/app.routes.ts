import { provideRouter, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { RegistroComponent } from './registro/registro.component';
import { HomeAerolineasComponent } from './home-aerolineas/home-aerolineas.component';
import { GestionVuelosComponent } from './gestion-vuelos/gestion-vuelos.component';
export const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'registro', component: RegistroComponent },
  { path: 'aerolinea', component: HomeAerolineasComponent },
  { path: 'vuelos', component: GestionVuelosComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' } // Redirección a home
];
