import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
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
export class VerificationComponent implements OnInit, OnChanges {

  token: string;
  tokenType: number;
  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private builder: FormBuilder,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private router: Router) {
    this.validateToken()
  }
  ngOnChanges(changes: SimpleChanges): void {
    throw new Error('Method not implemented.');
  }

  ngOnInit(): void {
    this.SetPasswordform = this.builder.group(
      {
        Password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(50)]],
        ConfirmPassword: ['', Validators.required]
      },
    );
  }

  SetPasswordform: FormGroup = new FormGroup({
    Password: new FormControl(''),
    ConfirmPassword: new FormControl(''),
  });

  validateToken() {
    this.route.queryParams.subscribe((params: any) => {
      this.token = params.token;
      this.tokenType = 3;
      if (this.token) {
        const userVerificationData = new UserVerification();
        userVerificationData.Token = this.token;
        userVerificationData.TokenType = this.tokenType;
        this.spinner.show();
        this.authService.UserVerification(userVerificationData).subscribe((response: ApiResponse) => {
          this.spinner.hide();
          if (response && response.ResponseStatus === 'Success') {
            this.spinner.hide();
          }
          else if (response.ResponseStatus === 'Failure') {
            this.toastr.error(response.ErrorData.Error);
          }
        });
      }
    });
  }

  get f(): { [key: string]: AbstractControl } {
    return this.SetPasswordform.controls;
  }

  setPassword() {
    if (this.SetPasswordform.valid) {

      if (this.SetPasswordform.value.Password !== this.SetPasswordform.value.ConfirmPassword) {
        this.toastr.error("Passwords do not match!");
        return;
      }

      // const token = localStorage.getItem('token');
      const setPassworddata = new SetPassword();
      setPassworddata.Token = this.token;
      setPassworddata.TokenType = this.tokenType;
      setPassworddata.Password = this.SetPasswordform.value.Password
      this.spinner.show();
      this.authService.SetPassword(setPassworddata).subscribe((response: ApiResponse) => {
      if (response && response.ResponseStatus === 'Success') {
        this.spinner.hide();
        this.toastr.success("Set Password successful");
        this.router.navigate(['/login']);
      }
      else if (response.ResponseStatus === 'Failure') {
        this.spinner.hide();
        this.toastr.error(response.ErrorData.Error);
      }
      })
    }
  }
}

