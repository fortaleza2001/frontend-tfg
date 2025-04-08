import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { UserService } from './services/user.service';
import { FormsModule } from '@angular/forms'; // Importar FormsModule aquí
import { HttpErrorResponse } from '@angular/common/http'; // Para manejar errores

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, FormsModule], // Agregar FormsModule aquí
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'frontend-tfg';

  constructor(private userService: UserService) {}

  ngOnInit(): void {
   
  }

  
}
