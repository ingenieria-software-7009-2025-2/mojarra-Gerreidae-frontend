import { Component } from '@angular/core';
// Para usar formularios
import { FormulariosModule } from '../../../shared/formularios-module';
// Manipulación de formularios
import { FormControl, FormGroup, Validators } from '@angular/forms';
// Respuestas a peticiones http
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
// Redireccionamiento
import { Router, RouterModule } from '@angular/router';
// Para manejar subscripciones a objetos observables
import { Subscription } from 'rxjs';

// Service del componente
import { AuthService } from './_service/auth.service';
// Mensajes personalizados
import { SwalMessages } from '../../../shared/swal-messages';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ FormulariosModule, RouterModule ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  /**
   * Suscripciones activas en el componente.
   */
  private subscriptions: Subscription[] = [];

  swal: SwalMessages = new SwalMessages(); // swal messages


  /** FormGroup para el formulario del login
   *
   * Un FormGroup es un conjunto de FormControl's que dependen
   * entre sí.
   *
   * Un FormControl sirve para monitorear el estado y valor de una
   * entrada en un formulario.
  */
  loginForm = new FormGroup (
    {
      mail: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required, Validators.minLength(8)])
    }
  )

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  /**
   * Getter para obtener el estado de los controladores
   * del formulario.
   */
  get loginFormControls() {
    return this.loginForm.controls;
  }

  /**
   * Función para realizar el login del usuario a
   * través del fomulario `loginForm`.
   */
  public onLogin() {
    if (this.loginForm.invalid) {
      this.swal.errorMessage('Por favor llena todos los campos correctamente.');
      return;
    }
  
    const loginFormValue = this.loginForm.value as { mail: string, password: string };
  
    this.subscriptions.push(
      this.authService.login(loginFormValue).subscribe({
        next: (response) => {
          if (response.body && response.body.token) {
            this.authService.saveToken(response.body.token);
            this.authService.saveIsAdmin(response.body.esAdministrador.toString());
            this.swal.successMessage('Sesión iniciada correctamente.');
            this.router.navigate(['/profile']);
          } else {
            this.swal.errorMessage('No se recibió el token de autenticación.');
          }
        },
        error: (e: HttpErrorResponse) => {
          console.error('Error en login:', e);
  
          if (e.status === 0) {
            this.swal.errorMessage('No se pudo conectar al servidor. Intenta más tarde.');
          } else if (e.status === 401) {
            this.swal.errorMessage('Correo o contraseña incorrectos.');
          } else {
            this.swal.errorMessage('Ocurrió un error inesperado. Intenta de nuevo.');
          }
        }
      })
    );
  }
  
  /**
   * Esta función es parte del ciclo de vida de los componentes de
   * angular, al igual que `ngOnInit`, pero `ngOnDestroy`
   * es el método que se ejecuta justo antes de que el
   * componente deje de ser visible, por ejemplo en un cambio de
   * página.
   *
   * Lo que hacemos en este caso es limpiar la lista de
   * suscripciones para liberar recursos y evitar suscripciones
   * huérfanas.
   */
  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}

