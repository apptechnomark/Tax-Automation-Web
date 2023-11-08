import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { SetPassword, UserDetails, UserVerification, login, saveUser } from 'src/global';
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  login(data: login) {
    return this.http.post(`${environment.user_manager_api + "auth/token"}`, data)
  }

  saveUser(data: saveUser) {
    const token = localStorage.getItem("token");
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.post(`${environment.user_manager_api + "user/save"}`, data, { headers })
  }

  UserVerification(data:UserVerification){
    return this.http.post(`${environment.user_manager_api + "auth/validatetoken"}`, data)
  }

  SetPassword(data: SetPassword){
    return this.http.post(`${environment.user_manager_api + "auth/setpassword"}`, data)
  }

  GetUserDetails(){
    const token = localStorage.getItem("token");
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.post(`${environment.user_manager_api + "user/getall"}`, {
      "PageNo": 1,
      "PageSize": 100,
      "GlobalFilter": "",
      "SortColumn": "",
      "IsDesc": false,
      "IsActive": true
   
  }, { headers })
  }
}
