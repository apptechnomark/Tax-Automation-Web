import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  login = {
    email: "",
    pass: ""
  }

  constructor(
    private router: Router,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
  }

  authenticate() {
    this.authService
      .login(this.login.email, this.login.pass)
      .subscribe((data) => {
        if (data) {
          this.router.navigate(['/main']);  // If valid and route to card
        }
      });
  }

}
