import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/services/api/api.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { ActionButton, TableColumn, TableData } from 'src/app/shared/table/table.component';
import { ApiResponse, Role } from 'src/global';
import Swal from 'sweetalert2';
declare var $: any;
@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {


  @ViewChild('addUserModal') addUserModal: ElementRef;
  @ViewChild('connectionModal') connectionModal: ElementRef;
  userDetails: any;
  isEditMode: boolean = false;
  TotalCount: number = 1;
  isAddCompanyModalOpen: boolean = false;
  ActionButtons: ActionButton[] = [
    { lable: "Edit", Action: 'Edit' },
    { lable: "Delete", Action: 'DeleteUser' },
    { lable: "Connect", Action: 'Connect' },
    { lable: "Resend Link", Action: 'onEmailResend' }
  ]
  tableData: TableData[];
  tableColumns: TableColumn[] = [
    { header: 'Name', field: 'FullName' },
    { header: 'Email', field: 'Email' },
    { header: 'Contact Number', field: 'ContactNo' },
    { header: 'Company', field: 'QBO_AccountName' },
    { header: 'Status', field: 'IsActive' },
  ];
  PageNo: number=1;
  select: any;


  options = [
    { label: "Admin", value: Role.Admin },
    { label: "Employee", value: Role.Employee }
  ];

  addUserform: FormGroup;

  UserDetailform: FormGroup ;

  CompanyConnectionform: FormGroup;
  companies: any[] = [];
  // CompanyConnectionform : FormGroup = new FormGroup({
  //   CompanyId: new FormControl()
  // });
  UserId: number;
  constructor(
    private builder: FormBuilder,
    private authService: AuthService,
    private Service: ApiService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {

    this.addUserform = this.builder.group(
      {
        FirstName: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
        LastName: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
        Email: ['', [Validators.required, Validators.email]],
        contactNo: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(10)]],
        Role: ['', [Validators.required]],
      },
    );

    this.CompanyConnectionform = this.builder.group({
      CompanyId: ['']
    })

    this.UserDetailform = this.builder.group(
      {
        PageNo: [this.PageNo],
        PageSize: ['5'],
        GlobalSearch: [''],
        SortColumn: [''],
        IsDesc: [false],
        IsActive: [true]
      },
    );
    this.getCompanies();
    this.GetAllUserDetail();
  }


  AddUserButton() {
    if (this.addUserform.valid) {
      this.spinner.show();
      this.authService.saveUser(this.addUserform.value).subscribe((response: ApiResponse) => {
        this.spinner.hide();
        if (response && response.ResponseStatus === 'Success') {
          this.toastr.success("User created successful");
          this.closeModal();
          this.GetAllUserDetail();
        }
        else if (response.ResponseStatus === 'Failure') {
          this.toastr.error(response.ErrorData.Error);
          this.openModal();
        }
      })
    } else
      this.toastr.warning("Invalid Form's Value")
  }

  UpdateUserButton() {
    if (this.addUserform.valid) {
      this.userDetails = {
        UserId: this.UserId,
        Email: this.addUserform.value.Email,
        FirstName: this.addUserform.value.FirstName,
        LastName: this.addUserform.value.LastName,
        ContactNo: this.addUserform.value.contactNo,
        Role : this.addUserform.value.Role
      };
      console.log(this.userDetails)
      this.authService.saveUser(this.userDetails).subscribe((response: ApiResponse) => {
        this.spinner.show();
        if (response && response.ResponseStatus === 'Success') {
          this.spinner.hide();
          console.log(response.Message);
          this.toastr.success("User updated successfully");
          this.closeModal();
          this.GetAllUserDetail();
        } else if (response.ResponseStatus === 'Failure') {
          this.spinner.hide();
          this.toastr.error(response.ErrorData.Error);
          console.log("Message", response.Message, "Error", response.ErrorData.Error);
        }
      });
    }
    else
      this.toastr.warning("Invalid Form's Value")

  }

  get abstract(): { [key: string]: AbstractControl } {
    return this.addUserform.controls;
  }

  openModal() {
    const modal: any = this.addUserModal.nativeElement;
    $(modal).modal('show');
    const buttonLabel = this.isEditMode ? 'Update User' : 'Add User';
    $('#addUserButton').text(buttonLabel);
  }

  closeModal() {
    const modal: any = this.addUserModal.nativeElement;
    $(modal).modal('hide');
    this.addUserform.reset();
    this.isEditMode = false;
  }

  GetAllUserDetail() {
    console.log("data", this.UserDetailform.value)
    this.spinner.show();
    this.authService.GetAllUserDetails(this.UserDetailform.value).subscribe((response: ApiResponse) => {
      this.spinner.hide();
      if (response && response.ResponseStatus === 'Success') {
        this.tableData = response.ResponseData.List;
        this.TotalCount = response.ResponseData.TotalCount;
        console.log(this.tableData, this.TotalCount)
      }
      else if (response.ResponseStatus === 'Failure') {
        this.toastr.error(response.ErrorData.Error);
        console.log("Message", response.Message, "Error", response.ErrorData.Error);
      }
    });
  }


  Search() {
    this.GetAllUserDetail()
  }

  populateEditForm(user: TableData) {
    this.UserId = user['UserId'];
    this.addUserform.patchValue({
      UserId: user['UserId'] || '',
      FirstName: user['FirstName'] || '',
      LastName: user['LastName'] || '',
      Email: user['Email'] || '',
      contactNo: user['ContactNo'] || '',
      Role: user['Role']
    });
    this.isEditMode = true;
    const select = user['Role'];
    const selectedRole = this.options.find(option => option.value === select);
    console.log('Selected Role:', selectedRole);

    if (selectedRole)
      this.addUserform.get('Role').setValue(selectedRole.value);
    else
      console.error('Invalid Role:', select);
    this.openModal();
  }

  DeleteUser($event: any) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this user!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.isConfirmed) {
        this.spinner.show();
        this.authService.Deleteuser({ UserId: $event.UserId }).subscribe((response: ApiResponse) => {
          this.spinner.hide();
          if (response && response.ResponseStatus === 'Success') {
            this.toastr.success('User deleted successfully');
            this.GetAllUserDetail();
          } else if (response.ResponseStatus === 'Failure') {
            if(response.Message=="User connect with company So User can't Delete")
              this.toastr.warning(response.ErrorData.Error);
            else
              this.toastr.error(response.ErrorData.Error);
            
          }
        });
      }
    });
  }

  ActiveInActive($event: any) {
    const userId = $event.UserId;
    const newStatus = !$event.IsActive;
    Swal.fire({
      title: 'Are you sure?',
      text: `Do you want to ${newStatus ? 'Activate' : 'InActivate'} this user?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.isConfirmed) {
        const user = { UserId: userId, ActiveStatus: newStatus };
        this.spinner.show();
        this.authService.ActiveInactiveUser(user).subscribe((response: ApiResponse) => {
          this.spinner.hide();
          if (response && response.ResponseStatus === 'Success') {
            const action = newStatus ? 'Activated' : 'InActivated';
            this.toastr.success(`User ${action} successfully`);
            this.GetAllUserDetail();
          } else if (response.ResponseStatus === 'Failure') {
            if(response.Message = "User connect with company So User can't Inactive")
              this.toastr.warning(response.ErrorData.Error);
            else this.toastr.error(response.ErrorData.Error);
          }
        });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire('Cancelled', 'User status change was cancelled', 'info');
      }
    });
  }
  onPageSizeChange(PageSize: any) {
    this.UserDetailform.get('PageSize').setValue(PageSize.pageSize);
    this.PageNo = 1;
    this.UserDetailform.get('PageNo').setValue(1);
    this.GetAllUserDetail()
  }
  onPageChange($event: any) {
    console.log($event.pageNo)
    this.UserDetailform.get('PageSize').setValue($event.pageSize);
    this.PageNo = $event.pageNo;
    this.UserDetailform.get('PageNo').setValue($event.pageNo);
    console.log(this.UserDetailform)
    this.GetAllUserDetail()
  }


  onEmailResend(data: any) {
    this.spinner.show();
    console.log("Email resend", data)
    this.authService.ResendLink(data).subscribe((response: ApiResponse) => {
      this.spinner.hide();
      if (response && response.ResponseStatus === 'Success') {
        this.toastr.success(`Email verifcation link send successfully`);
        this.GetAllUserDetail();
      } else if (response.ResponseStatus === 'Failure') {
        this.toastr.error(response.ErrorData.Error);
      }
    });
  }

  UserData: any;
  AddCompany(data: any) {
    console.log(data);
    this.UserData = data;
    this.openModalForConnection();
  }

  openModalForConnection() {
    const modal: any = this.connectionModal.nativeElement;
    $(modal).modal('show');
  }

  closeModalForConnection() {
    const modal: any = this.connectionModal.nativeElement;
    $(modal).modal('hide');
    this.CompanyConnectionform.reset();
    this.isEditMode = false;
  }

  ConnectCompany() {
    this.spinner.show();
    const combinedData = {
      ...this.CompanyConnectionform.value,
      "UserId": this.UserData.UserId,
      "id": this.UserData.QBO_ID
    };
    if (this.CompanyConnectionform.valid) {
      this.Service.AddConnection(combinedData).subscribe((response: ApiResponse) => {
        this.spinner.hide();
        if (response && response.ResponseStatus === 'Success') {
          this.toastr.success("Company Connected Successfully");
          this.GetAllUserDetail();
        }
        else if (response.ResponseStatus === 'Failure') {
          this.toastr.error(response.ErrorData.Error);
          console.log("Message", response.Message, "Error", response.ErrorData.Error);
        }
        this.closeModalForConnection();
      });
      this.GetAllUserDetail();
    }
  }

  handleActionClick(event: { action: string, data: any }) {
    const { action, data } = event;
    if (action === 'DeleteUser') {
      this.DeleteUser(data);
    } else if (action === 'Edit') {
      this.populateEditForm(data);
    } else if (action === 'onEmailResend') {
      this.onEmailResend(data);
    } else if (action === 'Connect') {
      this.AddCompany(data)
    }
    // Add more conditions for other actions if needed
  }

  getCompanies() {
    this.Service.CompanyDropDown().subscribe(
      (response: any) => {
        this.companies = response.ResponseData;
      },
      (error) => {
        console.error('Error fetching companies', error);
      }
    );
  }

  RemoveCompany(data: any) {
    this.UserData = data;
    const combinedData = {
      "CompanyId": this.UserData.QBO_DetailId,
      "UserId": this.UserData.UserId,
      "id": this.UserData.QBO_ID
    };

    Swal.fire({
      title: 'Are you sure?',
      text: 'You will remove the connection with this company!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, remove it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.isConfirmed) {
        this.spinner.show();
        this.Service.AddConnection(combinedData).subscribe((response: ApiResponse) => {
          this.spinner.hide();
          if (response && response.ResponseStatus === 'Success') {
            this.toastr.success("Company Removed Successfully");
            this.GetAllUserDetail();
          } else if (response.ResponseStatus === 'Failure') {
            this.toastr.error(response.ErrorData.Error);
            console.log("Message", response.Message, "Error", response.ErrorData.Error);
          }
          this.closeModalForConnection();
        });
      }
    });
  }

}
