import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from "@angular/common/http";
import { environment } from 'src/environments/environment';
import { CompanyFilter, QboParams, TokenInfo, qboDetail } from 'src/global';
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

  // Save Client information
  updateImportData(data:any){
    const token = localStorage.getItem("token");
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.post(`${environment.automation_api + "Import/Data"}`,data,{headers});
  }

  // Export Excel file
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
  
  // Import Excel file
  ImportExcel(formData: FormData,ClientId : number): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'ClientId': ClientId
    });
  
    return this.http.post(`${environment.automation_api}Import/Excel`, formData, { headers });
  }

  // Add Conenction to Company
  AddConnection(data:any){
    const token = localStorage.getItem("token");
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.post(`${environment.automation_api + "Qbo/AssignCompany"}`,data,{headers});
  }

  // Company DropDown 
  CompanyDropDown(){
    const token = localStorage.getItem("token");
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get(`${environment.automation_api + "Qbo/GetCompanyDropdown"}`,{headers});
  }

  // Add data To QBO 
  AddDataToQbo(){
    const token = localStorage.getItem("token");
    const clientId = localStorage.getItem("clientId");
    const data = {QboId: null, ClientId: clientId}
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.post(`${environment.automation_api + "Qbo/AddtoQbo"}`,data,{headers});
  }

  // Reverse Entry to close account
  ReversalEntry(){
    const token = localStorage.getItem("token");
    const clientId = localStorage.getItem("clientId");
    const data = {QboId: null, ClientId: clientId}
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.post(`${environment.automation_api + "Qbo/ReversalEntry"}`,data,{headers});
  }
  
  // Save Client Account 
  SaveClientAccount(data:any){
    const token = localStorage.getItem("token");
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.post(`${environment.automation_api + "SaveClientAccountDetail"}`,data,{headers});
  }

  // Get Client
  GetClient(){
    const token = localStorage.getItem("token");
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get(`${environment.automation_api + "GetClientDetail"}`,{headers});
  }

  // Create Vendor
  CreateVendor(data:any){
    const token = localStorage.getItem("token");
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.post(`${environment.automation_api + "Qbo/CreateVendor"}`,data,{headers});
  }

   // Create Customer
   CreateCustomer(data:any){
    const token = localStorage.getItem("token");
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.post(`${environment.automation_api + "Qbo/CreateCustomer"}`,data,{headers});
  }
}
