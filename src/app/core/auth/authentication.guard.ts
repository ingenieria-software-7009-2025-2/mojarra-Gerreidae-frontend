import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../modules/usuario/login/_service/auth.service';
import { inject } from '@angular/core';

export const authenticationGuard: CanActivateFn = (route, state) => {
  
  let estaLogeado = inject(AuthService).isUserLoggedIn();
  console.log(estaLogeado);
  if(!estaLogeado){
    console.log('No esta loggeado');
    return inject(Router).navigate(['/login']);
  }
  
  return true;
};
