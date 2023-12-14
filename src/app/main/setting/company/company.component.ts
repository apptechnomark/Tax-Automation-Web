import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/services/api/api.service';
import { ActionButton, TableColumn, TableData } from 'src/app/shared/table/table.component';
import { ApiResponse, CompanyFilter } from 'src/global';
import { Location } from '@angular/common';
declare var $: any;
@Component({
  selector: 'app-company',
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.scss']
})
export class CompanyComponent implements OnInit {
  @ViewChild('AddVendorModal') AddVendorModal: ElementRef;
  @ViewChild('AddVendorModal') AddCustomerModal: ElementRef;
  tableData: TableData[] = [];
  tableColumns: TableColumn[] = [
    { header: 'Company', field: 'CompanyName' },
    { header: 'Status', field: 'IsActive' }
  ];
  TotalCount: number;
  isEditMode: boolean = false;
  addform: FormGroup;
  PageNo: number = 1;
  CompanyDetailForm: FormGroup;
  ActionButtons: ActionButton[] = [
    { lable: "Customer", Action: 'AddCustomer' },
    { lable: "Vendor", Action: 'AddVendor' },
  ]
  title: string;
  CutomerName: string;
  VendorName: string;

  constructor(private service: ApiService, private toastr: ToastrService, private spinner: NgxSpinnerService, public builder: FormBuilder, private location: Location) {
    const role = localStorage.getItem('Role')
    if (Number(role) === 2) {
      this.location.back();
    }
  }
  ngOnInit(): void {
    this.addform = this.builder.group(
      {
        Name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
      },
    );

    this.CompanyDetailForm = this.builder.group(
      {
        PageNo: [this.PageNo],
        PageSize: ['5'],
        GlobalSearch: [''],
        SortColumn: [''],
        IsDesc: [false],
        IsActive: [true]
      },
    );
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
    this.service.GetCompanyList(this.CompanyDetailForm.value).subscribe((res: ApiResponse) => {
      this.spinner.hide();
      if (res && res.ResponseStatus === "Success") {
        this.tableData = res.ResponseData.List;
        this.TotalCount = res.ResponseData.TotalCount;
        this.CutomerName = res.ResponseData.List[0]?.CustomerName
        this.VendorName = res.ResponseData.List[0]?.vendorName
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
    this.openModel();

  }
  AddCustomer(data: any) {
   this.title = "Customer"
    this.openModel();
  }

  openModel() {
    const modal: any = this.AddVendorModal.nativeElement;
    $(modal).modal('show');
    if (this.title == "Customer")
      this.addform.patchValue({
        Name: this.CutomerName
      })
    else
      this.addform.patchValue({
        Name: this.VendorName
      })
    this.addform.controls?.['Name'].disable();
  }

  closeModal() {
    const modal: any = this.AddVendorModal.nativeElement;
    $(modal).modal('hide');
    this.addform.reset();
  }

  AddVendorButton() {
      if (this.addform.valid) {
      const value = { VendorName: this.addform.value.Name }
        this.service.CreateVendor(value).subscribe((response: ApiResponse) => {
        this.spinner.show();
        if (response && response.ResponseStatus === 'Success') {
          this.spinner.hide();
          this.toastr.success("Add Vendor successfully");
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

  AddCustomerButton() {
    if (this.addform.valid) {
      const value = { CustomerName: this.addform.value.Name }
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

  Search() {
    this.companyList()
  }

  onPageSizeChange(PageSize: any) {
    this.CompanyDetailForm.get('PageSize').setValue(PageSize.pageSize);
    this.PageNo = 1;
    this.CompanyDetailForm.get('PageNo').setValue(1);
    this.companyList()
  }

  onPageChange($event: any) {
    this.CompanyDetailForm.get('PageSize').setValue($event.pageSize);
    this.PageNo = $event.pageNo;
    this.CompanyDetailForm.get('PageNo').setValue($event.pageNo);
    this.companyList()
  }
}
