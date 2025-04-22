import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cambiar-contrasena',
  templateUrl: './cambiar-contrasena.component.html',
  imports:[FormsModule,CommonModule]
})
export class CambiarContrasenaComponent implements OnInit {
  password: string = '';
  confirmPassword: string = '';
  email: string = '';
  token: string = '';
  mensajeExito: string | null = null;
  mensajeError: string | null = null;
  token_valido:boolean | null = false;
  datosCargados:boolean = false;

  constructor(private route: ActivatedRoute, private userService: UserService,private router : Router) {}

  ngOnInit(): void {
    this.token = this.route.snapshot.queryParamMap.get('token') || '';
    this.email = this.route.snapshot.queryParamMap.get('email') || '';

    if (!this.token || !this.email) {
      this.mensajeError = 'El enlace no es válido o está incompleto.';
    }

    this.verificarToken();
  }

  cambiarContrasena() {
    if (this.password !== this.confirmPassword) {
      this.mensajeError = 'Las contraseñas no coinciden';
      this.mensajeExito = null;
      return;
    }
    this.userService.cambiarContrasena(this.token,this.email,this.password).subscribe({
      
      next: (response) => {
        console.log(response);
        this.router.navigate(["/home"]);
        
   
      },
      error: (error) => {
        console.error( error);
      
      
      }
    });

 
  }

  verificarToken() {
    this.userService.verificarTokenContraseña(this.token,this.email).subscribe({
      
      next: (response) => {
        console.log(response);
        this.token_valido=true;
        this.datosCargados=true;
   
      },
      error: (error) => {
        console.error( error);
        this.datosCargados=true;
      
      }
    });
  }



}
