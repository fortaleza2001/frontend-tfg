import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://mythical-airline.tech:8000';

  constructor(private http: HttpClient) {}

  // Obtener todos los usuarios
  loginUser(email: string, password: string): Observable<any> {
    const body = { email, password };
    return this.http.post(`${this.apiUrl}/login`, body, {
      headers: { 'Content-Type': 'application/json' }
    });
    
  }
 


}
