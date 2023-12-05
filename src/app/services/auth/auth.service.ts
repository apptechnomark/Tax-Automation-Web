import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { SetPassword, UserId, UserVerification, login, requestUserDetails, saveUser } from 'src/global';
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  // Login User 
  login(data: login) {
    return this.http.post(`${environment.user_manager_api + "auth/token"}`, data)
  }

  // Add/Update User Detail 
  saveUser(data: saveUser) {
    const token = localStorage.getItem("token");
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.post(`${environment.user_manager_api + "user/save"}`, data, { headers })
  }

  // User Verification 
  UserVerification(data: UserVerification) {
    return this.http.post(`${environment.user_manager_api + "auth/validatetoken"}`, data)
  }

  // Set Password
  SetPassword(data: SetPassword) {
    return this.http.post(`${environment.user_manager_api + "auth/setpassword"}`, data)
  }

  // Get All Users Detail List 
  GetAllUserDetails(data: requestUserDetails) {
    // const token = localStorage.getItem("token");
    // const headers = new HttpHeaders({
    //   'Authorization': `Bearer ${token}`
    // });
    return this.http.post(`${environment.user_manager_api + "user/getall"}`, data)
  }

  // Delete User 
  Deleteuser(UserId: UserId) {
    // const token = localStorage.getItem("token");
    // const headers = new HttpHeaders({
    //   'Authorization': `Bearer ${token}`
    // });
    return this.http.post(`${environment.user_manager_api + "user/delete"}`, UserId)
  }

  // Active InActive User  
  ActiveInactiveUser(UserId: any) {
    // const token = localStorage.getItem("token");
    // const headers = new HttpHeaders({
    //   'Authorization': `Bearer ${token}`
    // });
    return this.http.post(`${environment.user_manager_api + "user/activeinactive"}`, UserId)
  }

  // Resend Email Confirmation Link
  ResendLink(data: any) {
    return this.http.post(`${environment.user_manager_api + "user/ResendLink"}`, data);
  }

  // Get User Detail for a user
  getUserDetail() {
    return this.http.get(`${environment.user_manager_api + "auth/getuserdetails"}`);
  }

}
