import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { login, ApiResponse } from 'src/global';
import { ToastrService } from 'ngx-toastr';

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
    private authService: AuthService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
   this.loginform = this.builder.group(
      {
        Username: ['', [Validators.required, Validators.email]],
        Password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(50)]],
      },
    );
  }

  authenticate() {
    if (this.loginform.valid) {
      this.spinner.show();
      this.authService.login(this.loginform.value).subscribe((response: ApiResponse) => {
      this.spinner.hide();
        console.log(this.loginform.value.Username, this.loginform.value.Password);
        if (response && response.ResponseStatus === 'Success') {
          console.log(response.Message);
          this.toastr.success("Login successful");
          localStorage.setItem("isAuthenticate", "true");
          const token = response.ResponseData.Token.Token;
          localStorage.setItem('token', token);
          this.router.navigate(['/main']);
        }
        else if (response.ResponseStatus === 'Failure') {
          this.toastr.error(response.ErrorData.Error);
          console.log("Message", response.Message, "Error", response.ErrorData.Error);
        }
      })
    }
  }

  get f(): { [key: string]: AbstractControl } {
    return this.loginform.controls;
  }
}
