import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams, HttpResponse } from "@angular/common/http";
import { environment } from 'src/environments/environment';
import { ApiResponse, CompanyFilter, QboParams, TokenInfo, qboDetail } from 'src/global';
import { Observable } from 'rxjs';


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

  updateImportData(data:any){
    const token = localStorage.getItem("token");
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.post(`${environment.automation_api + "Import/Data"}`,data,{headers});
  }

  ExportExcel(): Observable<HttpResponse<ArrayBuffer>> {
    const token = localStorage.getItem("token");
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      'Accept': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    });

    return this.http.get(`${environment.automation_api + "Export/Excel"}`, {
      headers,
      responseType: 'arraybuffer',
      observe: 'response' 
    });
  }
  
  ImportExcel(formData: FormData,ClientId : number): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'ClientId': ClientId
    });
  
    return this.http.post(`${environment.automation_api}Import/Excel`, formData, { headers });
  }

  AddConnection(data:any){
    const token = localStorage.getItem("token");
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.post(`${environment.automation_api + "Qbo/AssignCompany"}`,data,{headers});
  }

  CompanyDropDown(){
    const token = localStorage.getItem("token");
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get(`${environment.automation_api + "Qbo/GetCompanyDropdown"}`,{headers});
  }
}
