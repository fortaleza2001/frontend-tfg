import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, switchMap } from 'rxjs';
import { environment } from '../../environments/environment';  // Importar el archivo de entorno

@Injectable({
  providedIn: 'root'
})
export class AerolineaService {

  private $apiUrl = environment.apiUrl;  // Uso consistente de $apiUrl

  constructor(private http: HttpClient) {} 

  getAerolineaUsuario(): Observable<any> {
    
        return this.http.get(`${this.$apiUrl}/aerolinea/usuario`, {
          headers: { 
            'Content-Type': 'application/json',
        
          },
          withCredentials: true // Aseguramos que se envíen las cookies con la solicitud
        });
  
  }

  getAerolinea(id: any): Observable<any> {
    return this.http.get(`${this.$apiUrl}/aerolinea/${id}`, {
      headers: { 
        'Content-Type': 'application/json'
      },
      withCredentials: true
    });
  }
  

  PostCrearAerolinea(Aerolinea: any,cuentaPago: any): Observable<any> {
    const formData = new FormData();
  
    if (Aerolinea?.nombreCreador) {
      formData.append('nombreCreador', Aerolinea.nombreCreador);
    }
    if (Aerolinea?.dniCreador) {
      formData.append('dniCreador', Aerolinea.dniCreador);
    }
    if (Aerolinea?.direccionCreador) {
      formData.append('direccionCreador', Aerolinea.direccionCreador);
    }
    if (Aerolinea?.fechaNacimientoCreador) {
      formData.append('fechaNacimientoCreador', Aerolinea.fechaNacimientoCreador);
    }
    if (Aerolinea?.numeroTelefono) {
      formData.append('numeroTelefono', Aerolinea.numeroTelefono);
    }
  
  
    if (cuentaPago?.nombreTarjeta) {
      formData.append('nombreTarjeta', cuentaPago.nombreTarjeta);
    }
    if (cuentaPago?.numeroTarjeta) {
      formData.append('numeroTarjeta', cuentaPago.numeroTarjeta);
    }
    if (cuentaPago?.fechaCaducidad) {
      formData.append('fechaCaducidad', cuentaPago.fechaCaducidad);
    }
    if (cuentaPago?.cvv) {
      formData.append('cvv', cuentaPago.cvv);
    }
  
    if (Aerolinea?.nombreAerolinea) {
      formData.append('nombreAerolinea', Aerolinea.nombreAerolinea);
      console.log(Aerolinea.nombreAerolinea);
    }
  
    if (Aerolinea?.codigoIATA) {
      formData.append('codigoIATA', Aerolinea.codigoIATA);
      console.log(Aerolinea.codigoIATA);
    }
  
    if (Aerolinea?.direccionAerolinea) {
      formData.append('direccionAerolinea', Aerolinea.direccionAerolinea);
      console.log(Aerolinea.direccionAerolinea);
    }
  
    if (Aerolinea?.paisOrigen) {
      formData.append('paisOrigen', Aerolinea.paisOrigen);
      console.log(Aerolinea.paisOrigen);
    }
  
    if (Aerolinea?.logoAerolinea) {
      formData.append('logoAerolinea', Aerolinea.logoAerolinea, Aerolinea.logoAerolinea.name);
      console.log(Aerolinea.logoAerolinea);
      console.log(Aerolinea.logoAerolinea.name);
    }
  
    console.log(formData);
  
    return this.http.post(`${this.$apiUrl}/aerolinea/CrearAerolinea`, formData, {
      withCredentials: true,
    });
  }
  

}
