import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../modules/usuario/login/_service/auth.service';
import { inject } from '@angular/core';

export const authorizationGuard: CanActivateFn = (route, state) => {
  const authenticationService = inject(AuthService);
  const router = inject(Router);
  
    if (!authenticationService.isUserAdmin()) {
      console.log('No tiene acceso a esta ruta. Para acceder ingrese con una cuenta de administrador.');
      return router.navigate(['map']);
    }
  
  return true; // Permite la navegación si el rol es admin
};
