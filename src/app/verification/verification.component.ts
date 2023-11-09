import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';
import { ApiResponse, SetPassword, UserVerification } from 'src/global';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-verification',
  templateUrl: './verification.component.html',
  styleUrls: ['./verification.component.scss']
})
export class VerificationComponent implements OnInit {

   token : string;
   tokenType :number = 3;
  constructor(
    private route:ActivatedRoute,
    private authService: AuthService,
    private builder: FormBuilder,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private router: Router){
    this.validateToken()
  }


    ngOnInit(): void {
      this.SetPasswordform = this.builder.group(
        {
          Password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(40)]],
        },
      );
    }

    SetPasswordform: FormGroup = new FormGroup({
      Password: new FormControl(''),
    });
  
    validateToken(){
      debugger
      this.route.queryParams.subscribe((params:any) => {
        this.token = params.token;
         this.tokenType  = 3;
        if(this.token){
          console.log(this.token);

          const userVerificationData = new UserVerification();
          userVerificationData.Token = this.token;
          userVerificationData.TokenType = this.tokenType;
          // console.log("data call",userVerificationData)
          this.authService.UserVerification(userVerificationData).subscribe((response: ApiResponse) => {
            this.spinner.show();
            if (response && response.ResponseStatus === 'Success') {
              this.spinner.hide();
              console.log("call");
              //  this.toastr.success("User Verfication successful");
              // localStorage.setItem("isAuthenticate", "true");
              // const token = response.ResponseData.Token.Token;
              // localStorage.setItem('token', token);
              // this.router.navigate(['/main']);
            }
            else if (response.ResponseStatus === 'Failure') {
              this.spinner.hide();
              console.log("Error");
              this.toastr.error(response.ErrorData.Error);
              console.log("Message", response.Message, "Error", response.ErrorData.Error);
            }
          });
        }
      });
    }

    get f(): { [key: string]: AbstractControl } {
      return this.SetPasswordform.controls;
    }

    setPassword(){
      if (this.SetPasswordform.valid) {

        // const token = localStorage.getItem('token');
        const setPassworddata = new SetPassword();
        setPassworddata.Token = this.token;
        setPassworddata.TokenType = this.tokenType;
        
        setPassworddata.Password = this.SetPasswordform.value.Password
        console.log("data call",setPassworddata)
       

        this.authService.SetPassword(setPassworddata).subscribe((response: ApiResponse) => {
          this.spinner.show();
          console.log(this.SetPasswordform.value);
          if (response && response.ResponseStatus === 'Success') {
            this.spinner.hide();
            console.log(response.Message);
            this.toastr.success("Set Password successful");
            this.router.navigate(['/login']);
          }
          else if (response.ResponseStatus === 'Failure') {
            this.spinner.hide();
            this.toastr.error(response.ErrorData.Error);
            console.log("Message", response.Message, "Error", response.ErrorData.Error);
          }
        })
      }
    }
}
