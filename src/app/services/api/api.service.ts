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
    const finalUrl = `${this.QboconnectionUrl}${params.toString()}`
    window.location.href = finalUrl;
  }

  GetQboToken(data:qboDetail) {
    return this.http.post(this.baseUrl + "Qbo/gettoken", data)
  }

  GetCompanyList(data: CompanyFilter){
    return this.http.post(this.baseUrl + "Qbo/getlist",data)
  }

  // Save Client information
  updateImportData(data:any){
    return this.http.post(`${environment.automation_api + "Import/Data"}`,data);
  }

  // Export Excel file
  ExportExcel(): Observable<HttpResponse<ArrayBuffer>> {
    const headers = new HttpHeaders({  
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
    return this.http.post(`${environment.automation_api}Import/Excel`, formData);
  }

  // Add Conenction to Company
  AddConnection(data:any){
    return this.http.post(`${environment.automation_api + "Qbo/AssignCompany"}`,data);
  }

  // Company DropDown 
  CompanyDropDown(){
    return this.http.get(`${environment.automation_api + "Qbo/GetCompanyDropdown"}`);
  }

  // Add data To QBO 
  AddDataToQbo(){
    const clientId = localStorage.getItem("clientId");
    const data = {QboId: null, ClientId: clientId}
    return this.http.post(`${environment.automation_api + "Qbo/AddtoQbo"}`,data);
  }

  // Reverse Entry to close account
  ReversalEntry(){
    const clientId = localStorage.getItem("clientId");
    const data = {QboId: null, ClientId: clientId}
    return this.http.post(`${environment.automation_api + "Qbo/ReversalEntry"}`,data);
  }
  
  // Save Client Account 
  SaveClientAccount(data:any){
    return this.http.post(`${environment.automation_api + "SaveClientAccountDetail"}`,data);
  }

  // Get Client
  GetClient(){
    return this.http.get(`${environment.automation_api + "GetClientDetail"}`);
  }

  // Create Vendor
  CreateVendor(data:any){
    return this.http.post(`${environment.automation_api + "Qbo/CreateVendor"}`,data);
  }

   // Create Customer
   CreateCustomer(data:any){
    return this.http.post(`${environment.automation_api + "Qbo/CreateCustomer"}`,data);
  }
}
