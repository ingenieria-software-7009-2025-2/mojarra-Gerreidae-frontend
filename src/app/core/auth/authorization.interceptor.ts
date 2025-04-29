import { HttpInterceptorFn } from '@angular/common/http';

/**
 * En Angular un Interceptor es usado para modificar 
 * tanto peticiones HTTP como sus respuestas antes de que
 * estas lleguen a su destino, en este caso nuestra API y nuestra
 * página web repectivamente.
 * 
 * Este Interceptor lo que hace es revisar automáticamente en 
 * cada petición que realiza nuestro frontend si existe un token
 * guardado en el Local Storage, en cuyo caso lo agrega 
 * como Header a la petición que se esté realizando (sin importar 
 * cual sea).
 * 
 * @param req la petición HTTP
 * @returns la petición con el header Authorization si 
 * existe el token o la misma petición en  caso contrario
 */
export const authorizationInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('token');
  if (req.url.startsWith('https://api.maptiler.com/geocoding')) {
    return next(req);
  }
  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `${token}`
      }
    });
  }
  return next(req);
};
