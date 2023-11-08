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
 
  options = [
    {label:"Admin",value: Role.Admin}, 
    {label:"Employee",value: Role.Employee}
  ];
  
  addUserform: FormGroup = new FormGroup({
    FirstName: new FormControl(''),
    LastName: new FormControl(''),
    Email: new FormControl(''),
    contactNo: new FormControl(''),
    role:new FormControl('')
  });
  constructor(
    private router: Router,
    private builder: FormBuilder,
    private authService: AuthService,
    private spinner:NgxSpinnerService,
    private toastr: ToastrService
  ) { 
    this.GetUserDetial()
  }

  ngOnInit(): void {
    
    this.addUserform = this.builder.group(
      {
        FirstName: ['', [Validators.required]],
        LastName: ['', [Validators.required]],
        Email: ['', [Validators.required]],
        contactNo: ['', [Validators.required]],
        role: ['', [Validators.required]],
      },
    );
  }

  addUser() {
    if (this.addUserform.valid) {
      console.log("data",this.addUserform)
      this.authService.saveUser(this.addUserform.value).subscribe((response: ApiResponse) => {
        this.spinner.show();
        if (response && response.ResponseStatus === 'Success') {
          this.spinner.hide();
          console.log(response.Message);
          this.toastr.success("User created successful");
          this.openModal();
          // this.router.navigate(['/user-verification']);
        }
        else if (response.ResponseStatus === 'Failure') {
          this.spinner.hide();
          this.toastr.error(response.ErrorData.Error);
          console.log("Message", response.Message, "Error", response.ErrorData.Error);
          this.openModal();
        }
      })
    }
  }
 
  get f(): { [key: string]: AbstractControl } {
    return this.addUserform.controls;
  }
  
  openModal() {
    this.addUserform.reset(); 
  }

  GetUserDetial(){
    this.authService.GetUserDetails().subscribe((response: ApiResponse) => {
      this.spinner.show();
      if (response && response.ResponseStatus === 'Success') {
        const responseData =response.ResponseData.List;
        const TotalCount = response.ResponseData.TotalCount;
        console.log(responseData, TotalCount)
        
        this.spinner.hide();
      }
      else if (response.ResponseStatus === 'Failure') {
        this.spinner.hide();
        this.toastr.error(response.ErrorData.Error);
        console.log("Message", response.Message, "Error", response.ErrorData.Error);
        // this.openModal();
      }
    });
  }
}
