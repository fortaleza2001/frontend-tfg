import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, switchMap } from 'rxjs';
import { environment } from '../../environments/environment';  // Importar el archivo de entorno

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private $apiUrl = environment.apiUrl;  // Uso consistente de $apiUrl

  constructor(private http: HttpClient) {}

  // Método para login de usuario
  loginUser(email: string, password: string): Observable<any> {
    const body = { email, password };
    
    // Realizamos una llamada a /sanctum/csrf-cookie para obtener el token CSRF antes del login
    return this.http.get(`${this.$apiUrl}/sanctum/csrf-cookie`, { withCredentials: true }).pipe(
      switchMap(() => {
        // Ahora que el token CSRF está disponible en las cookies, podemos hacer el login
        return this.http.post(`${this.$apiUrl}/login`, body, {
          headers: { 
            'Content-Type': 'application/json',
        
          },
          withCredentials: true // Aseguramos que se envíen las cookies con la solicitud
        });
      })
    );
  }

  checkAuthentication(): Observable<any> {
    return this.http.get(`${this.$apiUrl}/check-auth`, {
      withCredentials: true  // Aseguramos que la cookie HttpOnly se envíe con la solicitud
    });
  }
 
  logout(): Observable<any> {
    return this.http.get(`${this.$apiUrl}/logout`, {
      withCredentials: true  // Aseguramos que la cookie HttpOnly se envíe con la solicitud
    });
  }
}
