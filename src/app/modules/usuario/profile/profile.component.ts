import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { FormulariosModule } from '../../../shared/formularios-module';
import { CommonModule } from '@angular/common'
import { RouterModule } from '@angular/router';
import { SwalMessages } from '../../../shared/swal-messages';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { ModifyService } from './_service/modify.service';
import { MeResponse } from './_model/MeResponse';
import { MeService } from './_service/me.service';
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
  public user: MeResponse = new MeResponse();

  swal: SwalMessages = new SwalMessages(); // swal messages
 
  mostrarFormulario = false;
  /**
   * Formulario utilizado para hacer el update de mensajes.
   */
  updateForm = new FormGroup({
    nombre : new FormControl('', [Validators.required]),
    apellidoP: new FormControl('', [Validators.required]),
    apellidoM: new FormControl('', [Validators.required]),
    mail: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(8)]),
    confirmPassword: new FormControl('', [])
  });

  constructor (
    private router: Router,
    private modifyService: ModifyService,
    private meService: MeService
  ){}

  onSubmit() {
    if (this.updateForm.valid) {
      // console.log(JSON.stringify(this.updateForm.value))
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
            this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
              this.router.navigate(['/profile']);
            });            
          },
          error: (error) => {
            this.swal.errorMessage('Error al actualizar usuario: ' + error);
          }
        })
      );
    }
  }
  editarPerfil() {
    this.updateForm.patchValue({
      nombre: this.user.nombre,
      apellidoP: this.user.apellidoP,
      apellidoM: this.user.apellidoM,
      mail: this.user.mail,
      password: '', // se deja vacío por seguridad
      confirmPassword: ''
    });
    
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

    ngOnInit(): void{
      this.meObten();
    }



   meObten(): void {
    this.subscriptions.push(
      this.meService.me().subscribe({
        next: (response) => {
          console.log(response.body);
          this.user.nombre = response.body? response.body.nombre : "";
          this.user.apellidoM = response.body? response.body.apellidoM : "";
          this.user.apellidoP = response.body? response.body.apellidoP : "";
          this.user.mail = response.body? response.body.mail : "";
        },
        error: (error) => {
          this.swal.errorMessage('Error al actualizar usuario: ' + error);
        }
      })
    );
   }





/*
meObten(): void {
  this.subscriptions.push(
    this.meService.me().subscribe({
      next: (response) => {
        const { nombre = '', apellidoM = '', apellidoP = '', correo = '' } = response.body || {};
        this.user = { nombre, apellidoM, apellidoP, correo };
      },
      error: (error) => {
        this.swal.errorMessage('Error al obtener usuario: ' + error);
      }
    })
  );
}
*/

}
