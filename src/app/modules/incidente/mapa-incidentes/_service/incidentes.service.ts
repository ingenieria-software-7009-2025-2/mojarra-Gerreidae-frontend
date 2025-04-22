import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Incidente } from '../_model/Incidente';
import { mjs_api_uri } from '../../../../shared/mjs-api-uri';

@Injectable({
  providedIn: 'root'
})
export class IncidentesService {

  constructor(private http: HttpClient) { }

  public getIncidentes(): Observable<HttpResponse<Incidente[]>>{
    return this.http.get<Incidente[]>(`${mjs_api_uri}/v1/incidentes`, { observe: 'response' });
  }
}
