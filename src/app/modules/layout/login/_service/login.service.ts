import { Injectable } from '@angular/core';
// Para realizar peticiones http y recibir respuestas.
import { HttpClient, HttpResponse } from '@angular/common/http';
import { mjs_api_uri } from '../../../../shared/mjs-api-uri';
import { Observable } from 'rxjs';
import { LoginResponse } from '../_model/LoginResponse';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  // Token del usuario
  private authtoken: string | null;

  constructor(private http: HttpClient) {
    this.authtoken = null;
  }

  public login(credenciales: {mail?: string, password?: string}): Observable<HttpResponse<LoginResponse>> {
    return this.http.post<LoginResponse>(`${mjs_api_uri}/v1/users/login`, credenciales, { observe: 'response' });
  }

  public saveToken(token: string): void {
    this.authtoken = token;
    localStorage.setItem('authtoken', token);
  }
}
