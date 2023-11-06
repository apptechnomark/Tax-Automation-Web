import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

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
  return this.http.post<boolean>('http://localhost:7005/api/auth/token', requestBody);
  }

}
