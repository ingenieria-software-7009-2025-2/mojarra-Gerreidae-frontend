import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common'
import { AuthService } from '../usuario/login/_service/auth.service';
import { SwalMessages } from '../../shared/swal-messages';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-template',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './template.component.html',
  styleUrl: './template.component.css'
})

export class TemplateComponent {

  constructor(
    private router: Router,
    private authService:AuthService
  ){}

  /**
   * Suscripciones activas en el componente.
   */
    private subscriptions: Subscription[] = [];
    swal: SwalMessages = new SwalMessages(); // swal messages

  get isLoggedIn(): boolean {
    return this.authService.isUserLoggedIn();
  }

  get isUserAdmin(): boolean {
    return this.authService.isUserAdmin();
  }

  cerrarSesion() {
    this.subscriptions.push(
      this.authService.logout().subscribe ({
        next: () => {
          this.authService.deleteToken();
          this.authService.deleteIsAdmin();

          this.swal.successMessage('Se cerró tu sesión correctamente');
          this.router.navigate(['/']);

        },
        error: (e) => {
          console.log(e);
        }
      }
    ))
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}
