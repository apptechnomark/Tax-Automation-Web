import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth/auth.service';
import { ApiResponse, Role } from 'src/global';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {

  FirstName!: string;
  LastName!: string;
  Email!: string;
  contactNo!:number;
 
  options = [
    {label:"Admin",value: Role.Admin}, 
    {label:"Employee",value: Role.Employee}
  ];
  
  addUserform: FormGroup = new FormGroup({
    FirstName: new FormControl(''),
    LastName: new FormControl(''),
    Email: new FormControl(''),
    contactNo: new FormControl(''),
  });
  constructor(
    private router: Router,
    private builder: FormBuilder,
    private authService: AuthService,
    private spinner:NgxSpinnerService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    
    this.addUserform = this.builder.group(
      {
        FirstName: ['', [Validators.required]],
        LastName: ['', [Validators.required]],
        Email: ['', [Validators.required]],
        contactNo: ['', [Validators.required]],
        
      },
    );
  }

 
  // addUser() {
    
  //   if (this.addUserform.valid) {
  //     this.authService.saveUser(this.addUserform.value).subscribe((data) => {
  //       this.spinner.show();
  //       // console.log(this.loginform.value.Username, this.loginform.value.Password);
  //       if (data ) {
  //         this.router.navigate(['/main']);  
  //       }
  //     })
  //   }
  // }
  addUser() {
    if (this.addUserform.valid) {
      this.authService.saveUser(this.addUserform.value).subscribe((response: ApiResponse) => {
        this.spinner.show();
        // console.log(this.addUserform.value.Username, this.addUserform.value.Password);
        if (response && response.ResponseStatus === 'Success') {
          this.spinner.hide();
          console.log(response.Message);
          this.toastr.success("Login successful");
          localStorage.setItem("isAuthenticate", "true");
          const token = response.ResponseData.Token.Token;
          localStorage.setItem('token', token);
          this.router.navigate(['/main']);
        }
        else if (response.ResponseStatus === 'Failure') {
          this.spinner.hide();
          this.toastr.error(response.ErrorData.Error);
          console.log("Message", response.Message, "Error", response.ErrorData.Error);
        }
      })
    }
  }
 
  get f(): { [key: string]: AbstractControl } {
    return this.addUserform.controls;
  }

}
