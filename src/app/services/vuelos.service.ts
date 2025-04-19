import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, switchMap } from 'rxjs';
import { environment } from '../../environments/environment';  // Importar el archivo de entorno

@Injectable({
  providedIn: 'root'
})
export class VuelosService {



  private $apiUrl = environment.apiUrl;  // Uso consistente de $apiUrl

  constructor(private http: HttpClient) {}

  // Método para login de usuario
  postCrearVuelo(vuelo:any,id_aerolinea:any,tickets:any): Observable<any> {
    const body = { vuelo,id_aerolinea,tickets };
    
        return this.http.post(`${this.$apiUrl}/aerolinea/CrearVuelo`, body, {
          headers: { 
            'Content-Type': 'application/json',
        
          },
          withCredentials: true // Aseguramos que se envíen las cookies con la solicitud
        });
  
  }

  getVuelosAerolinea(id:any): Observable<any> {
    
    return this.http.get(`${this.$apiUrl}/aerolinea/${id}/vuelos`, {
      headers: { 
        'Content-Type': 'application/json',
    
      },
      withCredentials: true // Aseguramos que se envíen las cookies con la solicitud
    });

}

}
