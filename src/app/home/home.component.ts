import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  
  constructor(private http: HttpClient, private cookieService: CookieService,private router: Router) { }

  ngOnInit(): void {
    // Comprobamos si la cookie auth-token existe
    const authToken = this.cookieService.get('auth-token');
    
    if (authToken) {
      // Si la cookie existe, hacemos una llamada HTTP para comprobarla
      this.verifyAuthToken(authToken);
    } else {
      console.log('No auth-token found');
      // Aquí puedes redirigir a la página de login o mostrar un mensaje
    }
  }

  // Método para verificar el token
  verifyAuthToken(token: string): void {
    const url = 'http://api.example.com/verify-token'; // Cambia esta URL a la de tu API
    const headers = { 'Authorization': `Bearer ${token}` };
    
    this.http.get(url, { headers }).subscribe(
      (response) => {
        console.log('Token validado correctamente', response);
        this.router.navigate(['/home']);
      },
      (error) => {
        console.error('Error al verificar el token', error);
        // Aquí puedes manejar lo que pasa si el token es inválido
      }
    );
  }
}
