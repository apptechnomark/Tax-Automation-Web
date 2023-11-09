import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from "@angular/common/http";
import { environment } from 'src/environments/environment';
import { CompanyFilter, QboParams, TokenInfo, qboDetail } from 'src/global';


@Injectable({
  providedIn: 'root'
})
export class ApiService {
  baseUrl = environment.automation_api
  QboconnectionUrl:string = environment.qbologin_url;
  constructor(
    private http: HttpClient
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
    window.location.href = finalUrl;
  }

  GetQboToken(data:qboDetail) {
    const token = localStorage.getItem("token");
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    var urlData:TokenInfo = {
      code:data.code,
      companyId:Number(data.realmId)
    }
    return this.http.post(this.baseUrl + "Qbo/gettoken", data,{headers})
  }

  GetCompanyList(data: CompanyFilter){
    const token = localStorage.getItem("token");
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.post(this.baseUrl + "Qbo/getlist",data,{headers})
  }
}
