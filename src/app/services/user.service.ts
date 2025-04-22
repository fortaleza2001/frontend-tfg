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
    
        return this.http.post(`${this.$apiUrl}/login`, body, {
          headers: { 
            'Content-Type': 'application/json',
        
          },
          withCredentials: true // Aseguramos que se envíen las cookies con la solicitud
        });
  
  }

  solicitarCambioPassword(email: string): Observable<any> {
    const body = { email };
    
        return this.http.post(`${this.$apiUrl}/forgot-password`, body, {
          headers: { 
            'Content-Type': 'application/json',
        
          },
        });
  
  }

  verificarTokenContraseña(token:string,email: string): Observable<any> {
    const body = { token,email };
    
        return this.http.post(`${this.$apiUrl}/verificar-token-pass`, body, {
          headers: { 
            'Content-Type': 'application/json',
        
          },
        });
  
  }

  cambiarContrasena(token:string,email: string,password: string): Observable<any> {
    const body = { token,email,password };
    
        return this.http.post(`${this.$apiUrl}/cambiar-contrasena`, body, {
          headers: { 
            'Content-Type': 'application/json',
        
          },
        });
  
  }
  loginwithGithub()
  {
    window.location.href = `${this.$apiUrl}/auth/github`;
  }
  loginwithGoogle()
  {
    window.location.href = `${this.$apiUrl}/auth/google`;
  }
  loginwithFacebook()
  {
    window.location.href = `${this.$apiUrl}/auth/facebook`;
  }

  registerUser(email: string, password: string): Observable<any> {
    const body = { email, password };

        return this.http.post(`${this.$apiUrl}/registro`, body, {
          headers: { 
            'Content-Type': 'application/json',
        
          },
          withCredentials: true // Aseguramos que se envíen las cookies con la solicitud
        });
  
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
