import { Component } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common'
@Component({
  selector: 'app-profile',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
  standalone: true
})
export class ProfileComponent {
  mostrarFormulario = false;
  perfilForm = new FormGroup({

  });
  onSubmit() {
    if (this.perfilForm.valid) {
      this.mostrarFormulario = false;
    }
  }
  editarPerfil() {
    this.mostrarFormulario = true;
  }

  cancelarEdicion() {
    this.mostrarFormulario = false;
  }
}
