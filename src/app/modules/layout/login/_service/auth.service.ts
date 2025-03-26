import { Injectable } from '@angular/core';
// Para realizar peticiones http y recibir respuestas.
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

// URI de la API
import { mjs_api_uri } from '../../../../shared/mjs-api-uri';
// Modelo de la respuesta de un login
import { LoginResponse } from '../_model/LoginResponse';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Token del usuario
  private token: string | null;

  constructor(private http: HttpClient) {
    this.token = null;
  }

  /**
   * Función para realizar una petición de login a la
   * API de MojarraDrive.
   *
   * @param credenciales el correo y la contraseña del
   * usuario que quiere ingresar.
   * @returns un observable que emite la respuesta HTTP de la
   * API, en formato `LoginResponse`
   */
  public login(credenciales: {mail?: string, password?: string}): Observable<HttpResponse<LoginResponse>> {
    return this.http.post<LoginResponse>(`${mjs_api_uri}/v1/users/login`, credenciales, { observe: 'response' });
  }

  /**
   * Función para realizar una petición de logout a la
   * API de MojarraDrive.
   *
   * @returns un observable que emite la respuesta HTTP de la
   * API.
   */
  public logout(): Observable<HttpResponse<number>> {
    return this.http.post<number>(`${mjs_api_uri}/v1/users/logout`, null, { observe: 'response' });
  }


  public createUser(): Observable<HttpResponse<number>> {;
    return this.http.post<number>(`${mjs_api_uri}/v1/users`, null, { observe: 'response' });
  }

  /**
   * Función para eliminar el token del usuario
   * del Local Storage.
   */
  public deleteToken(): void {
    this.token = null;
    localStorage.removeItem('token');
  }

  /**
   * Función para guardar en el Local Storage el token del usuario.
   *
   * @param token el token del usuario
   */
  public saveToken(token: string): void {
    this.token = token;
    localStorage.setItem('token', token);
  }

  /**
   * Función para cargar el token del usuario desde el
   * Local Storage.
   */
  public setToken(): void {
    this.token = localStorage.getItem('token');
  }

  /**
   * Función para obtener el token delusuario.
   *
   * @returns el token del usuario o null
   */
  public getToken(): string | null {
    return this.token;
  }
}
