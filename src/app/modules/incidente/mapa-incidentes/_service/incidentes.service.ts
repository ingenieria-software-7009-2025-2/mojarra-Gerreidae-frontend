import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Incidente } from '../_model/Incidente';
import { mjs_api_uri } from '../../../../shared/mjs-api-uri';
import { HashResponse } from '../_model/HashResponse';

@Injectable({
  providedIn: 'root'
})
export class IncidentesService {

  constructor(private http: HttpClient) { }

  public getIncidentes(): Observable<HttpResponse<Incidente[]>>{
    return this.http.get<Incidente[]>(`${mjs_api_uri}/v1/incident/getAll`, { observe: 'response' });
  }

  public getEstados(): Observable<HttpResponse<HashResponse>>{
    return this.http.get<HashResponse>(`${mjs_api_uri}/v1/incident/estados`, { observe: 'response' });
  }

  public getTipos(): Observable<HttpResponse<HashResponse>>{
    return this.http.get<HashResponse>(`${mjs_api_uri}/v1/incident/tipos`, { observe: 'response' });
  }

  public postIncidente(payload): Observable<string> {
      return this.http.post<string>(`${mjs_api_uri}/v1/incident`, payload, { responseType: 'text' as 'json' });
  }
}
