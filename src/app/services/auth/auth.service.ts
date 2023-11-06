import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map, of } from 'rxjs';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  isAuthenticate: boolean = false;

  login(Username: string, Password: string): Observable<boolean> {
    const requestBody = { Username, Password };
    console.log("call",requestBody)
    localStorage.setItem("isAuthenticate", "true");
    this.isAuthenticate = true;
    return this.http.post<any>(`${environment.user_manager_api + "auth/token"}`, requestBody).pipe(
      map((response) => {
        if (response && response.ResponseStatus === 'Success' && response.ResponseData.Token) {
          const token = response.ResponseData.Token.Token;
          localStorage.setItem('token', token); 
          this.isAuthenticate = true;
          return true;
        } else 
          return false;
       })
    );
  }

}
