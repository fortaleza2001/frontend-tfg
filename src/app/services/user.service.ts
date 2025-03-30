import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, } from 'rxjs';
import { environment } from '../../environments/environment';  // Importar el archivo de entorno
@Injectable({
  providedIn: 'root'
})
export class UserService {
  private $apiUrl = environment.apiUrl;
  apiUrl: any;


  constructor(private http: HttpClient) {}

  // Obtener todos los usuarios
  loginUser(email: string, password: string): Observable<any> {
    const body = { email, password };
    return this.http.post(`${this.apiUrl}/login`, body, {
      headers: { 'Content-Type': 'application/json' }
    });
    
  }
 

  loginUserGoogle(): Observable<any>{
      
      return this.http.get(`${this.apiUrl}/login/google`,  {
        headers: { 'Content-Type': 'application/json' }
      });
  }

}
