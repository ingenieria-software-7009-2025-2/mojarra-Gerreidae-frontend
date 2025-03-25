import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common'
@Component({
  selector: 'app-template',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './template.component.html',
  styleUrl: './template.component.css'
})
export class TemplateComponent {
  get isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  cerrarSesion() {
    localStorage.removeItem('token'); // o tu lógica real de logout
    window.location.href = '/'; // o usa router.navigate(['/']);
  }
}
