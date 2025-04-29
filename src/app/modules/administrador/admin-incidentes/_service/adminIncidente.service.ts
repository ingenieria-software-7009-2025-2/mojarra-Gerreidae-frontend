import { HttpClient, HttpResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { mjs_api_uri } from '../../../../shared/mjs-api-uri';
import { IncidenteDTO } from '../../../incidente/mapa-incidentes/_model/IncidenteDTO';

@Injectable({
  providedIn: 'root'
})
export class AdminIncidenteService {

  constructor(private http: HttpClient) { }

  // Lista de todos los incidentes
  getAllIncidentes(): Observable<IncidenteDTO[]> {
      return this.http.get<IncidenteDTO[]>(`${mjs_api_uri}/v1/incident/getAll`);
  }

  // Eliminar incidente
  deleteIncidente(id: number): Observable<any> {
    return this.http.delete<any>(`${mjs_api_uri}/v1/incident/${id}`);
  }
}
