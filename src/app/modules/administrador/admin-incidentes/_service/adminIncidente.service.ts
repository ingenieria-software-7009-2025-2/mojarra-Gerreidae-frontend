import { HttpClient, HttpResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { mjs_api_uri } from '../../../../shared/mjs-api-uri';

@Injectable({
  providedIn: 'root'
})
export class AdminIncidenteService {

  constructor(private http: HttpClient) { }

  // Lista de todos los incidentes
  getAllIncidentes(): Observable<any[]> {
      const token = localStorage.getItem('token');
      const headers = new HttpHeaders().set('Authorization', `${token}`);

      return this.http.get<any[]>(`${mjs_api_uri}/v1/incident/getAll`, { headers });

    }

  // Eliminar incidente
  deleteIncidente(id: number): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `${token}`);

    return this.http.delete<any>(`${mjs_api_uri}/v1/incident/${id}`, { headers });
  }
}
