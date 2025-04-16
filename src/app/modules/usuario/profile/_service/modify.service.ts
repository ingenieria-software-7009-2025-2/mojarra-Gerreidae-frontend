import { Injectable } from '@angular/core';
// Para realizar peticiones http y recibir respuestas.
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

// URI de la API
import { mjs_api_uri } from '../../../../shared/mjs-api-uri';
// Modelo de la respuesta de una operación de actualización
import { UpdateResponse } from '../_model/UpdateResponse';


@Injectable({
  providedIn: 'root'
})

export class ModifyService {

  constructor(private http: HttpClient) { }
  /**
   * Función para realizar una petición de update a la
   * API de MojarraDrive.
   *
   * @param nuevosValores Son todos los valores nuevos que se 
   * han modificado de nuestro objeto.
   * @returns un observable que emite la respuesta HTTP de la
   * API, en formato `UpdateResponse`.
   */
  public update(nuevosValores: {
      nombre: string;
      apellidoP: string;
      apellidoM: string;
      mail: string;
      password: string;
  }): Observable<HttpResponse<UpdateResponse>>{
    return this.http.put<UpdateResponse>(`${mjs_api_uri}/v1/users/me`, nuevosValores, { observe: 'response' });
  }
}
