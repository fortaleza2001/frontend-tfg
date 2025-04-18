import { Component, OnInit, HostListener } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  imports: [CommonModule]
})
export class HomeComponent implements OnInit {
  isLoggedIn: boolean = false; // Cambia este valor según el estado de autenticación
  username: string = '';
  isLoading: boolean = true; // Controla el estado de carga
  menuOpen = false;

  constructor(
    private http: HttpClient, 
    private cookieService: CookieService,
    private router: Router,
    private userService: UserService
  ) {}
  dropdownOpen = false;

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

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
      },
      (error) => {
        console.error('Error al comprobar la autenticación', error);
        this.isLoggedIn = false;
        this.isLoading = false;
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


}
