import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-company-not-connect-page',
  templateUrl: './company-not-connect-page.component.html',
  styleUrls: ['./company-not-connect-page.component.scss']
})
export class CompanyNotConnectPageComponent {

  constructor(private router: Router) { }
  logoutUser() {
    localStorage.removeItem("isAuthenticate");
    localStorage.removeItem("token");
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}
