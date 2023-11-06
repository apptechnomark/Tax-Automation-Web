import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  Username!: string;
  Password!: string;

  loginform: FormGroup = new FormGroup({
    Username: new FormControl(''),
    Password: new FormControl(''),
  });
  constructor(
    private router: Router,
    private builder: FormBuilder,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.loginform = this.builder.group(
      {
        Username: ['', [Validators.required, Validators.email]],
        Password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(40)]],
      },
    );
  }

  authenticate() {
    if (this.loginform.valid) {
      this.authService.login(this.loginform.value.Username, this.loginform.value.Password).subscribe((data) => {
        console.log(this.loginform.value.Username, this.loginform.value.Password);
        if (data ) {
          this.router.navigate(['/main']);  
        }
      })
    }
  }

 
  get f(): { [key: string]: AbstractControl } {
    return this.loginform.controls;
  }
}
