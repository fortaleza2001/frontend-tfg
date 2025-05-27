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

  postBuscar(busqueda: any): Observable<any> {
    const body = busqueda; // Ya no es necesario envolverlo en un objeto adicional, ya que 'busqueda' es el objeto que vas a enviar
  
    return this.http.post(`${this.$apiUrl}/buscar-vuelos`, body, {
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true, // Aseguramos que se envíen las cookies con la solicitud
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

obtenerpaises(): Observable<any> {
    
  return this.http.get(`${this.$apiUrl}/obtener-paises`, {
    headers: { 
      'Content-Type': 'application/json',
  
    },
    withCredentials: true // Aseguramos que se envíen las cookies con la solicitud
  });

}

obtenerAeropuertosPais(pais:any): Observable<any> {
    
  return this.http.get(`${this.$apiUrl}/obtener-aeropuertos/${pais}`, {
    headers: { 
      'Content-Type': 'application/json',
  
    },
    withCredentials: true // Aseguramos que se envíen las cookies con la solicitud
  });

}

obtenerVuelo(id:any): Observable<any> {
    
  return this.http.get(`${this.$apiUrl}/obtener-vuelo/${id}`, {
    headers: { 
      'Content-Type': 'application/json',
  
    },
    withCredentials: true // Aseguramos que se envíen las cookies con la solicitud
  });

}
obtenerVueloReserva(): Observable<any> {
    
  return this.http.get(`${this.$apiUrl}/reservas/vuelos`, {
    headers: { 
      'Content-Type': 'application/json',
  
    },
    withCredentials: true // Aseguramos que se envíen las cookies con la solicitud
  });

}

obtenerVueloReservaDetalle($id:any): Observable<any> {
    
  return this.http.get(`${this.$apiUrl}/obtenerReservas/${$id}`, {
    headers: { 
      'Content-Type': 'application/json',
  
    },
    withCredentials: true // Aseguramos que se envíen las cookies con la solicitud
  });

}

DevolverTicket(id: any, motivo: any): Observable<any> {
  return this.http.post(
    `${this.$apiUrl}/devolverTicket/${id}`,
    { motivo }, // esto es el body
    {
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true, // se mantiene aquí
    }
  );
}

DescargarTicket(id:any): Observable<Blob> {
  return this.http.get(`${this.$apiUrl}/ticket/${id}`, {
    headers: { 
      'Content-Type': 'application/json',
    },
    withCredentials: true,  // Para enviar las cookies de autenticación si es necesario
    responseType: 'blob'    // Importante para manejar la respuesta como un Blob (archivo binario)
  });
}
DescargarFactura(id:any): Observable<Blob> {
  return this.http.get(`${this.$apiUrl}/generar-factura/${id}`, {
    headers: { 
      'Content-Type': 'application/json',
    },
    withCredentials: true,  // Para enviar las cookies de autenticación si es necesario
    responseType: 'blob'    // Importante para manejar la respuesta como un Blob (archivo binario)
  });
}

ComprarPedido(vuelo: any, pedidos: any, billetes: any,pago:any): Observable<any> {
  // Preparamos los datos a enviar en el cuerpo de la solicitud
  const body = {
    vuelo: vuelo,          // Incluimos el vuelo
    tickets: pedidos,      // Incluimos los pedidos
    billetes: billetes,
    pagos:pago
  };

  // Realizamos la solicitud POST con el cuerpo
  return this.http.post(`${this.$apiUrl}/vuelos/comprarVuelo`, body, {
    headers: {
      'Content-Type': 'application/json',
    },
    withCredentials: true  // Aseguramos que se envíen las cookies con la solicitud
  });
}


}
