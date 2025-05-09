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
  private esAdministrador: string | null;

  constructor(private http: HttpClient) {
    this.token = null;
    this.esAdministrador = null;
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
  public logout(): Observable<string> {
    return this.http.post('http://localhost:8080/v1/users/logout', null, { responseType: 'text' });
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
   * Función para eliminar el rol del usuario
   * del Local Storage.
   */
  public deleteIsAdmin(): void {
    this.esAdministrador = null;
    localStorage.removeItem('esAdministrador');
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
   * Función para guardar en el Local Storage el rol del usuario
   *
   * @param esAdministrador el rol del usuario
   */
  public saveIsAdmin(esAdministrador: string): void {
    this.esAdministrador = esAdministrador;
    localStorage.setItem('esAdministrador', esAdministrador);
  }

  /**
   * Función para cargar el token del usuario desde el
   * Local Storage.
   */
  public loadToken(): void {
    this.token = localStorage.getItem('token');
  }

  /**
   * Función para cargar el rol del usuario desde el
   * Local Storage.
   */
  public loadIsAdmin(): void {
    this.esAdministrador = localStorage.getItem('esAdministrador');
  }

  /**
   * Función para obtener el token del usuario.
   *
   * @returns el token del usuario o null
   */
  public getToken(): string | null {
    return this.token;
  }

  /**
   * Función para obtener el rol del usuario.
   *
   * @returns el rol del usuario o null
   */
  public getIsAdmin(): string | null {
    return this.esAdministrador;
  }

  /**
   * Función para obtener si el usuario es un administrador
   *
   * @returns boolean indicando si el usuario es Administrador
   */
  public isUserAdmin(): boolean {
    this.loadIsAdmin();
    return this.esAdministrador == "1";
  }

  public isUserLoggedIn(): boolean {
    this.loadToken();
    return !!this.token;
  }

 public cleaning(): void {
   localStorage.clear();
 }
}
