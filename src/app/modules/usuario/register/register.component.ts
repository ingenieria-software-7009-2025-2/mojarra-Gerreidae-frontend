import { Component } from '@angular/core';

// Para usar formularios 
import { FormulariosModule } from '../../../shared/formularios-module';
// Manipulacion de formularios 
import { FormControl, FormGroup, Validators } from '@angular/forms';
// Respuestas a peticiones http
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
// Redireccionamiento
import { Router, RouterModule} from '@angular/router'
// Para manejar subscripciones a objetos observables
import { Subscription } from 'rxjs';

// Service del componente 
import { RegisterService } from './_service/register.service';
// Mensajes personalizados
import { SwalMessages } from '../../../shared/swal-messages';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ FormulariosModule, RouterModule ],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})

export class RegisterComponent {
  /**
   * Suscripciones activas en el componente.
   */
  private subscriptions: Subscription[] = [];

  swal: SwalMessages = new SwalMessages(); // swal messages

  /**
   * FormGroup para el formulario del register
   */
  registerForm = new FormGroup({
    nombre: new FormControl('', [Validators.required]),
    apellidoP: new FormControl('', [Validators.required]),
    apellidoM: new FormControl('', [Validators.required]),
    mail: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(8)]),
    confirmPassword: new FormControl('', [Validators.required])
  });

  constructor(
    private router: Router,
    private registerService: RegisterService
  ) {}

  /**
   * Getter para obtener el estado de los 
   * controladores del formulario
   */
  get registerFormControls() {
    return this.registerForm.controls;
  }

  /**
   * Funcion para realizar el registro del usuario
   * a través del formulario 'registerForm'
   */
  public onRegister() {
    if (this.registerForm.invalid) {
      this.swal.errorMessage('Por favor complete todos los campos correctamente.');
      return;
    }

    if (this.registerForm.value.password !== this.registerForm.value.confirmPassword) {
      this.swal.errorMessage('Las contraseñas no coinciden.');
      return;
    }

    // obtenemos los valores del formulario
    const userData = this.registerForm.value;
    const registerFormValue = this.registerForm.value as { 
      idUsuario: number;
      nombre: string;
      apellidoP: string;
      apellidoM: string;
      mail: string;
      password: string;
    };
    
    this.subscriptions.push(
      this.registerService.register(registerFormValue).subscribe({
        next: () => {
          this.swal.successMessage('Usuario registrado con éxito');
          this.router.navigate(['/login']); // Redirrecciona al login
        },
        error: (error) => {
          this.swal.errorMessage('Error al registrar usuario: ' + error.error.message);
        }
      })
    );
  }

  /**
   * libera recursos
   */
  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}
