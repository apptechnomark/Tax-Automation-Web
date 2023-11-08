import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  logoutUser() {
    localStorage.removeItem("isAuthenticate");
    localStorage.removeItem("token");
    localStorage.clear();
    this.router.navigate(['/login']);
  }

}
