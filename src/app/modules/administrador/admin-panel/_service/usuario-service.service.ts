import { Injectable } from '@angular/core';
import { mjs_api_uri } from '../../../../shared/mjs-api-uri';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../_model/User.dto';

@Injectable({
  providedIn: 'root'
})
export class UsuarioServiceService {

  private baseUrl: string=`${mjs_api_uri}`;
  
  // Inyección de dependencias
  constructor(private httpClient:HttpClient) { }

  obtenerTodosLosUsuarios(): Observable<User[]>{
    return this.httpClient.get<User[]>(`${mjs_api_uri}/v1/users/getAllUsers`);
  }

  actualizarUSuario(user: User): Observable<User>{
    return this.httpClient.put<User>(`${mjs_api_uri}/v1/users/me`, user);
  }

  eliminarUsuario(user: User): Observable<string>{
    return this.httpClient.delete<string>(`${mjs_api_uri}/v1/users/${user.idUsuario}`);
  }
}
