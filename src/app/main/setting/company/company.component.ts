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
  CutomerName : string | null;
  VendorName : string | null;
  
  constructor(private service: ApiService, private toastr: ToastrService, private spinner: NgxSpinnerService, public builder: FormBuilder) {
    this.addform = this.builder.group(
      {
        Name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
        QboId : ['']
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
      if (res && res.ResponseStatus === "Success") {
        this.tableData = res.ResponseData.List;
        this.TotalCount = res.ResponseData.TotalCount;
          this.CutomerName= res.ResponseData.List[0].CustomerName
          this.VendorName = res.ResponseData.List[0].vendorName
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
    this.title = "Vendor" 
    this.addform.controls?.['QboId'].patchValue(data?.id)
    this.openModel();

  }
  AddCustomer(data: any) {
    this.title = "Customer"
    this.addform.controls?.['QboId'].patchValue(data?.id)
    this.openModel();
  }

  openModel(){
    const modal: any = this.AddVendorModal.nativeElement;
    $(modal).modal('show');
    if(this.title == "Customer")
      this.addform.patchValue({
        Name : this.CutomerName 
      })
    else 
      this.addform.patchValue({
        Name : this.VendorName 
      })
      if(this.addform.controls?.['Name'].value){   
        this.addform.controls?.['Name'].disable();
      }
      else{
        this.addform.controls?.['Name'].enable();
      }
      
    }

  closeModal() {
    const modal: any = this.AddVendorModal.nativeElement;
    $(modal).modal('hide');
    this.addform.reset();
  }
  
  AddVendorButton() {
    if(this.addform.valid){
      const value = { VendorName : this.addform.value.Name, QboId : this.addform.value.QboId}
      this.service.CreateVendor(value).subscribe((response: ApiResponse) => {
        this.spinner.show();
        if (response && response.ResponseStatus === 'Success') {
          this.spinner.hide();
          this.toastr.success("Add Vendor successfully");
          this.closeModal();
          this.addform.reset();
          this.companyList();
          // this.GetAllUserDetail();
        } else if (response.ResponseStatus === 'Failure') {
          this.spinner.hide();
          this.toastr.error(response.ErrorData.Error);
        }
      });
    }
    else 
      this.toastr.warning("Invalid Form's Value")
  }

  AddCustomerButton() {
    if(this.addform.valid){
      const value = { CustomerName : this.addform.value.Name,  QboId : this.addform.value.QboId}
      this.service.CreateCustomer(value).subscribe((response: ApiResponse) => {
        this.spinner.show();
        if (response && response.ResponseStatus === 'Success') {
          this.spinner.hide();
          this.toastr.success("Add Customer successfully");
          this.closeModal();
          this.addform.reset();
          } else if (response.ResponseStatus === 'Failure') {
          this.spinner.hide();
          this.toastr.error(response.ErrorData.Error);
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
