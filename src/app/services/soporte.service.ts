import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, switchMap } from 'rxjs';
import { environment } from '../../environments/environment';  // Importar el archivo de entorno

@Injectable({
  providedIn: 'root'
})
export class SoporteService {

  private $apiUrl = environment.apiUrl;  // Uso consistente de $apiUrl

  constructor(private http: HttpClient) {}

  // Método para login de usuario
  postMandarSoporte(email:any , mensaje:any): Observable<any> {
    const body = { email,mensaje };
    
        return this.http.post(`${this.$apiUrl}/soporte/mensaje`, body, {
          headers: { 
            'Content-Type': 'application/json',
        
          },
          withCredentials: true // Aseguramos que se envíen las cookies con la solicitud
        });
  
  }
}
