import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { login } from 'src/global';
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  

  login(data:login) {
    
    return this.http.post<any>(`${environment.user_manager_api + "auth/token"}`, data)
   
  }

  saveUser(data: any){
   
    // console.log("call",requestBody)
    const token = localStorage.getItem("token"); 
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    // this.isAuthenticate = true;
    return this.http.post<any>(`${environment.user_manager_api + "user/save"}`, data,{ headers })
    
    // .pipe(
    //   map((response) => {
    //     if (response && response.ResponseStatus === 'Success' && response.ResponseData.Token) {
    //       const token = response.ResponseData.Token.Token;
    //       localStorage.setItem('token', token); 
    //       // this.isAuthenticate = true;
    //       return true;
    //     } else 
    //       return false;
    //    })
    // );
  }

}
