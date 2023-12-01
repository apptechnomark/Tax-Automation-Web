import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/services/api/api.service';
import { ActionButton, TableColumn, TableData } from 'src/app/shared/table/table.component';
import { ApiResponse, CompanyFilter } from 'src/global';
declare var $: any;
@Component({
  selector: 'app-company',
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.scss']
})
export class CompanyComponent implements OnInit {
  @ViewChild('AddVendorModal') AddVendorModal: ElementRef;
  @ViewChild('AddVendorModal') AddCustomerModal: ElementRef;
  tableData: TableData[];
  tableColumns: TableColumn[] = [
    { header: 'Company', field: 'CompanyName' },
    { header: 'Status', field: 'IsActive' }
  ];
  TotalCount: number;
  isEditMode: boolean = false;
  addform: FormGroup;
  ActionButtons: ActionButton[] = [
    { lable: "Customer", Action: 'AddCustomer' },
    { lable: "Vendor", Action: 'AddVendor' },
  ]
  title : string;
 
  
  constructor(private service: ApiService, private toastr: ToastrService, private spinner: NgxSpinnerService, public builder: FormBuilder) {
    this.addform = this.builder.group(
      {
        Name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
      },
    );

    // this.addCutomerform = this.builder.group(
    //   {
    //     CustomerName: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
    //   }
    // );
  }
  ngOnInit(): void {
    this.companyList();
  }
  QboConnect() {
    this.service.QboConnection();
  }

  companyList() {
    const Filter: CompanyFilter = {
      PageNo: 1,
      PageSize: 100,
      GlobalFilter: null,
      SortColumn: null,
      IsDesc: false,
      IsActive: null
    }
    this.spinner.show();
    this.service.GetCompanyList(Filter).subscribe((res: ApiResponse) => {
      this.spinner.hide();
      console.log(res);
      if (res && res.ResponseStatus === "Success") {
        this.tableData = res.ResponseData.List;
        this.TotalCount = res.ResponseData.TotalCount;
      } else if (res.ResponseStatus === "Failure") {
        this.toastr.error(res.ErrorData.Message);
      }
    })
  }

  handleActionClick(event: { action: string, data: any }) {
    const { action, data } = event;
    if (action === "AddVendor")
      this.AddVendor(data);
    else if (action === "AddCustomer")
      this.AddCustomer(data);
  }

  AddVendor(data: any) {
    console.log(data);
    this.title = "Vendor" 
    this.openModel();

  }
  AddCustomer(data: any) {
    console.log(data);
    this.title = "Customer"
    this.openModel();
  }

  openModel(){
    const modal: any = this.AddVendorModal.nativeElement;
    $(modal).modal('show');
  }

  closeModal() {
    const modal: any = this.AddVendorModal.nativeElement;
    $(modal).modal('hide');
    this.addform.reset();
  }
  
  AddVendorButton() {
    console.log("Vendor");
    
    if(this.addform.valid){
      console.log(this.addform)
      const value = { VendorName : this.addform.value.Name}
      console.log(value);
      
      this.service.CreateVendor(value).subscribe((response: ApiResponse) => {
        this.spinner.show();
        if (response && response.ResponseStatus === 'Success') {
          this.spinner.hide();
          console.log(response.Message);
          this.toastr.success("Add Vendor successfully");
          this.closeModal();
          this.addform.reset();
          // this.GetAllUserDetail();
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

  AddCustomerButton() {
    console.log("Customer");
    
    if(this.addform.valid){
      console.log(this.addform)
      const value = { CustomerName : this.addform.value.Name}
      console.log(value);
      this.service.CreateCustomer(value).subscribe((response: ApiResponse) => {
        this.spinner.show();
        if (response && response.ResponseStatus === 'Success') {
          this.spinner.hide();
          console.log(response.Message);
          this.toastr.success("Add Customer successfully");
          this.closeModal();
          this.addform.reset();
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
      return this.addform.controls;
  }

}
