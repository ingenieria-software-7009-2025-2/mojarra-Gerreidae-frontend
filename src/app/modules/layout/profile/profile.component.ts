import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { FormulariosModule } from '../../../shared/formularios-module';
import { CommonModule } from '@angular/common'
import { RouterModule } from '@angular/router';
import { SwalMessages } from '../../../shared/swal-messages';
import { Subscription } from 'rxjs';
import { Router } from '../../../../../node_modules/@angular/router/index';
import { ModifyService } from './_service/modify.service';
@Component({
  selector: 'app-profile',
  imports: [FormulariosModule, RouterModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  standalone: true
})
export class ProfileComponent {
  /**
   * Suscripciones activas en el componente.
   */
   private subscriptions: Subscription[] = [];

   swal: SwalMessages = new SwalMessages(); // swal messages
 
  mostrarFormulario = false;
  /**
   * Formulario utilizado para hacer el update de mensajes.
   */
  updateForm = new FormGroup({
    nombre : new FormControl('', []),
    apellidoP: new FormControl('', []),
    apellidoM: new FormControl('', []),
    mail: new FormControl('', [Validators.email]),
    password: new FormControl('', [Validators.minLength(8)]),
    confirmPassword: new FormControl('', [])
  });

  constructor (
    private modifyService: ModifyService
  ){}

  onSubmit() {
    if (this.updateForm.valid) {
      this.mostrarFormulario = false;
      if (this.updateForm.value.password !== this.updateForm.value.confirmPassword && this.updateForm.value.password != "") {
        this.swal.errorMessage('Las contraseñas no coinciden.');
        return;
      }
      const updateFormValue = this.updateForm.value as { 
        idUsuario: number;
        nombre: string;
        apellidoP: string;
        apellidoM: string;
        mail: string;
        password: string;
      };
      this.subscriptions.push(
        this.modifyService.update(updateFormValue).subscribe({
          next: () => {
            this.swal.successMessage('Usuario actualizado con éxito');
          },
          error: (error) => {
            this.swal.errorMessage('Error al actualizar usuario: ' + error.error.message);
          }
        })
      );
    }
  }
  editarPerfil() {
    this.mostrarFormulario = true;
  }

  cancelarEdicion() {
    this.mostrarFormulario = false;
  }
  /**
   * libera recursos
   */
   ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}
