import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from "@angular/common/http";
import { environment } from 'src/environments/environment';
import { QboParams } from 'src/global';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  QboconnectionUrl:string = environment.qbologin_url;
  constructor(
    private http: HttpClient,
  ) { }

  //API Call Place here....
  QboConnection(){
    const params = new HttpParams()
    .set('client_id',environment.qboId)
    .set('response_type', QboParams.ResponseType)
    .set('scope', QboParams.Scope)
    .set('redirect_uri', QboParams.redirectUri)
    .set('state', QboParams.State);
    console.log(params.toString());
    console.log("Connection: ","test");

    const finalUrl = `${this.QboconnectionUrl}${params.toString()}`
    console.log("URL",finalUrl);
  }
}
