import { Injectable } from '@angular/core';

import { HttpClient, HttpResponse } from '@angular/common/http';
import { MeResponse } from '../_model/MeResponse';
import { Observable } from 'rxjs';

// URI de la API
import { mjs_api_uri } from '../../../../shared/mjs-api-uri';

@Injectable({
  providedIn: 'root'
})
export class MeService {

  constructor(private http: HttpClient) { }

  public me(): Observable<HttpResponse<MeResponse>>{
    return this.http.get<MeResponse>(`${mjs_api_uri}/v1/users/me`, { observe: 'response' });
  }


}
