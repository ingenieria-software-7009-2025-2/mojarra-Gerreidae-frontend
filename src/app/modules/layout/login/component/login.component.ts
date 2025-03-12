import { Component } from '@angular/core';
// Para usar formularios
import { FormulariosModule } from '../../../../shared/formularios-module';
// Manipulación de formularios
import { FormControl, FormGroup, Validators } from '@angular/forms';
// Respuestas a peticiones http
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
// Redireccionamiento
import { Router, RouterModule } from '@angular/router';
// Para manejar subscripciones a objetos observables
import { Subscription } from 'rxjs';

// Service del componente
import { LoginService } from '../_service/login.service';
// Modelo de la respuesta de un login
import { LoginResponse } from '../_model/LoginResponse';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ FormulariosModule, RouterModule ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  private subscriptions: Subscription[] = [];

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
      correo: new FormControl('', [Validators.required]),
      contraseña: new FormControl('', [Validators.required, Validators.minLength(8)])
    }
  )

  constructor( 
    private router: Router,
    private loginService: LoginService 
  ) {}

  public onLogin() {
    // obtenemos los valores del formulario
    var loginFormValue = this.loginForm.value as { correo: string, contraseña:string };

    this.subscriptions.push(
      this.loginService.login(loginFormValue).subscribe (
        (response: HttpResponse<LoginResponse>) => {
          if (response.body && response.body.token) {
            this.loginService.saveToken(response.body.token);
            
            console.log('Se inició sesión');
            this.router.navigateByUrl(''); 
          } else {
            if (response.body === null) {
              console.log('La API no devolvió cuerpo en la respuesta');
              return;
            }
            console.log('El token devuelto no fue poblado');
            return;
          }          
        },
        (errorResponse: HttpErrorResponse) => {
          alert(errorResponse.error.message);
        }
      )
    );
  }
}

