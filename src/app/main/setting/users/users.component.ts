import { Component,OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth/auth.service';
import { TableColumn, TableData } from 'src/app/shared/table/table.component';
import { ApiResponse, Role, requestUserDetails } from 'src/global';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
  TotalCount : number;

  tableData: TableData[];
  tableColumns: TableColumn[]=[
    { header: 'Name', field: 'FullName' },
    { header: 'Role', field: 'RoleName' },
    { header: 'Email', field: 'Email' },
    { header: 'Contact Number', field: 'ContactNo' }
  ];

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

  UserDetailform : FormGroup = new FormGroup({
    PageNo : new FormControl(1),
    PageSize : new FormControl(100),
    GlobalSearch : new FormControl(''),
    SortColumn : new FormControl(''),
    IsDesc : new FormControl(false),
    IsActive : new FormControl(false),
  });
  constructor(
    private router: Router,
    private builder: FormBuilder,
    private authService: AuthService,
    private spinner:NgxSpinnerService,
    private toastr: ToastrService
  ) {   }
  @ViewChild('closebutton') closebutton;
  ngOnInit(): void {
    this.GetUserDetial();
    this.addUserform = this.builder.group(
      {
        FirstName: ['', [Validators.required]],
        LastName: ['', [Validators.required]],
        Email: ['', [Validators.required]],
        contactNo: ['', [Validators.required]],
        role: ['', [Validators.required]],
      },
    );

    this.UserDetailform = this.builder.group(
      {
        PageNo: [1],
        PageSize: [100],
        GlobalSearch: [''],
        SortColumn: [''],
        IsDesc: [false],
        IsActive: [false]
      },
    );
    console.log(this.UserDetailform.value)
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
          this.closeAddUserModal();
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

  closeAddUserModal() {
    this.closebutton.nativeElement.click();
  }
  GetUserDetial(){
    console.log("data" , this.UserDetailform.value )
    this.authService.GetUserDetails(this.UserDetailform.value).subscribe((response: ApiResponse) => {
      this.spinner.show();
      if (response && response.ResponseStatus === 'Success') {
        this.tableData =response.ResponseData.List;
        this.TotalCount = response.ResponseData.TotalCount;
        console.log(this.tableData, this.TotalCount)
        
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

  Search(){
    this.GetUserDetial()
  }
  EditUser($event : Event){
    console.log($event)
  }

  DeleteUser($event : Event){
    console.log($event);
    
  }
}
