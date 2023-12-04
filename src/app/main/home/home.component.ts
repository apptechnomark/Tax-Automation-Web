import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/services/api/api.service';
import { ApiResponse } from 'src/global';
import { HttpResponse } from '@angular/common/http';
import * as XLSX from 'xlsx';
import { TableColumn, TableData } from 'src/app/shared/table/table.component';
import Swal from 'sweetalert2';

declare var $: any;
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  finalData = [];
  data: TableData[] = [];
  deletedRowId: any[] = [];
  IsClientField: boolean = true;
  form!: FormGroup;
  client: any;
  qbobuttons: boolean = false;
  ClientId: number;
  showUploadButton: boolean;

  headers: TableColumn[] = [
    { header: 'Id', field: 'Id' },
    { header: 'Name', field: 'name' },
    { header: 'Accoun Type', field: 'accounttype' },
    { header: 'Account Subtype', field: 'accountsubtype' },
    { header: 'Date', field: 'Date' },
    { header: 'Debit', field: 'debit' },
    { header: 'Credit', field: 'credit' },
    { header: 'Error', field: 'ErrorDetail' },
  ];
  @ViewChild('fileInput') fileInput: ElementRef;
  clientform: FormGroup = new FormGroup({
    Clientname: new FormControl(''),
    Password: new FormControl(''),
  });
  constructor(
    private builder: FormBuilder,
    private service: ApiService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.clientform = this.builder.group({
      Clientname: [
        '',
        [
          Validators.required,
          Validators.minLength(4),
          Validators.maxLength(50),
        ],
      ],
      Year: ['', [Validators.required]],
      FormType: ['', [Validators.required]],
    });
    if (this.data.length > 0) {
      this.initializeForm();
    }
    this.ButtonHideShow()
    this.GetclientDetials();
  }

  GetclientDetials() {
    this.spinner.show();
    this.service.GetClient().subscribe((res: ApiResponse) => {
      this.spinner.hide();
      if (res && res.ResponseStatus === 'Success') {
        if (res.ResponseData?.clientUserMappings != null) {
          this.IsClientField = false
          this.ClientId = res.ResponseData.clientUserMappings?.Id
          localStorage.setItem("clientId", String(this.ClientId))
          this.clientform.patchValue({
            Clientname: res.ResponseData.clientUserMappings?.ClientName,
            Year: res.ResponseData.clientUserMappings?.Year,
            FormType: res.ResponseData.clientUserMappings?.Formtype
          })
          this.clientform.controls?.['Clientname'].disable();
          this.clientform.controls?.['Year'].disable();
          this.clientform.controls?.['FormType'].disable();
        }
        if (res.ResponseData?.clientAccountDetail) {
          if (res.ResponseData)
            this.data = res.ResponseData?.clientAccountDetail
          if (this.data.length > 0) {
            this.initializeForm();
          }
          if (this.data.length === 0) {
            this.qbobuttons = true
          }
        }
      }
      else if (res.ResponseStatus === 'Failure') {
        this.toastr.error(res.ErrorData.Error);
      }
    })
  }

  // Save Client Detail Button Click 
  SaveClientButton() {
    this.spinner.show();
    if (this.clientform.valid) {
      this.service.updateImportData(this.clientform.value).subscribe((response: ApiResponse) => {
        this.spinner.hide();
        if (response && response.ResponseStatus === 'Success') {
          this.ClientId = response.ResponseData.Id
          localStorage.setItem('clientId', response.ResponseData.Id)
          this.clientform.patchValue({
            Clientname: response.ResponseData.ClientName,
            Year: response.ResponseData.Year,
            FormType: response.ResponseData.Formtype
          })
          this.clientform.controls?.['Clientname'].disable();
          this.clientform.controls?.['Year'].disable();
          this.clientform.controls?.['FormType'].disable();
          localStorage.setItem('showUploadButton', 'true');
          this.ButtonHideShow()
          this.toastr.success("Client Detail Added");
        }
        else if (response.ResponseStatus === 'Failure') {
          this.toastr.error(response.ErrorData.Error);
        }
      })
    }
    else
      this.toastr.error("Invalid Form's Value")
  }

  get abstract(): { [key: string]: AbstractControl } {
    return this.clientform.controls;
  }

  // Export Excel Button 
  ExportExcelButton() {
    const fileName = 'Export.xlsx';
    this.spinner.show();
    this.service.ExportExcel().subscribe(
      (response: HttpResponse<ArrayBuffer>) => {
        this.spinner.hide();
        const arrayBuffer = response.body;
        const workbook: XLSX.WorkBook = XLSX.read(new Uint8Array(arrayBuffer), {
          type: 'array',
        });
        const sheetName = workbook.SheetNames[0];
        const excelData: XLSX.WorkSheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(excelData, { header: 1 });
        const blob = new Blob([arrayBuffer], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        });
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      },
      (error) => {
        this.toastr.error('Failed to fetch Excel data.');
        console.error('Error fetching Excel data:', error);
      }
    );
  }

  uploadedFile: any;

  onFileChange(event: any) {
    const file = event.target.files[0];
    this.uploadedFile = file;
  }
  // Import Excel Button
  UploadExcelButton() {
    this.GetclientDetials();
    if (!this.uploadedFile) {
      this.toastr.warning('Please select a file.');
      return;
    }

    const formData = new FormData();
    formData.append('file', this.uploadedFile);
    this.client = localStorage.getItem('clientId');
    this.spinner.show();
    this.service
      .ImportExcel(formData, this.client)
      .subscribe((response: any) => {
        this.spinner.hide();
        if (response && response.ResponseStatus === 'Success') {
          this.data = response.ResponseData
          localStorage.setItem('showUploadButton', 'false');
          if (this.data.length > 0) {
            this.initializeForm();
          }
          if (this.data.length === 0) {
            this.qbobuttons = true
          }
          this.GetclientDetials()
          localStorage.setItem('showUploadButton', 'false');
          this.ButtonHideShow();
          this.toastr.success('File uploaded successfully');
          this.fileInput.nativeElement.value = '';
        } else if (response.ResponseStatus === 'Failure') {
          this.toastr.error(response.Message);
          this.fileInput.nativeElement.value = '';
        }
      });
  }


  //Add Qbo Process button 
  AddtoQboButton() {
    this.spinner.show();
    this.service.AddDataToQbo().subscribe((res: any) => {
      this.spinner.hide();
      if (res && res.ResponseStatus === 'Success') {
        this.toastr.success("Data added successfully");
      }
      else if (res.ResponseStatus === 'Failure') {
        if (res.ErrorData.ErrorDetail != null) {
          this.toastr.warning(res.Message)
          this.data = res.ErrorData.ErrorDetail
          this.initializeForm();
        }
      }
    })
  }

  // Reversal Entry Button
  RevrseEntryButton() {
    this.spinner.show();
    this.service.ReversalEntry().subscribe((res: any) => {
      this.spinner.hide();
      if (res && res.ResponseStatus === 'Success') {
        this.toastr.success("All Account has been Inactivated", "Client Has Been Disconnected",);
        this.clientform.reset();
        this.IsClientField = true;
        this.clientform.controls?.['Clientname'].enable();
        this.clientform.controls?.['Year'].enable();
        this.clientform.controls?.['FormType'].enable();
        this.ClientId = null
        this.qbobuttons = false
      }
      else if (res.ResponseStatus === 'Failure') {
        this.toastr.error(res.ErrorData.Error)
      }
    })
  }

  //#endregion
  //#region  error table
  initializeForm(): void {
    const formControls: any = {};

    this.data.forEach((row, rowIndex) => {
      this.headers.forEach((header, columnIndex) => {
        let initialValue = row[header.field];
        let validators = [];

        if (header.field === 'debit' || header.field === 'credit') {
          let decimalValue  = parseFloat(initialValue).toFixed(2);
          initialValue = {value: decimalValue, disabled: true}
        }
        formControls[`${rowIndex}_${header.field}`] = [
          initialValue,
          validators
        ];
      });
    });

    this.form = this.builder.group(formControls);
  }

  getCellControl(rowIndex: number, field: string): any {
    return this.form.get(`${rowIndex}_${field}`);
  }

  onCellChange(rowIndex: number, field: string, event: any): void {
    const control = this.form.get(`${rowIndex}_${field}`);
    const currentValue = control?.value;

    control?.setValue(event.target.value);

    if (control && control.valid) {
      const inputElement = document.getElementById(`${rowIndex}_${field}`);
      inputElement?.classList.remove('error-border');
    }
    // Update the data array
    this.data[rowIndex][field] = event.target.value;
  }

  onDeleteRow(rowIndex: number) {
    Swal.fire({
      title: 'Are you sure?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.isConfirmed) {
        this.deletedRowId = [...this.deletedRowId, this.data[rowIndex]?.['Id']]
        this.data.splice(rowIndex, 1);
        const currentFormValues = this.form.getRawValue();
        // this.headers.forEach((item) => {
        //   delete currentFormValues[`${rowIndex}_${item.field}`];
        // });
        this.initializeForm();
      }
    })
  }

  onSaveButton() {
    const transformedData: TableData[] = [];
    this.spinner.show();
    for (let i = 0; i < this.data.length; i++) {
      const transformedRow: TableData = {};

      this.headers.forEach((header) => {
        if (header.field !== 'action' && header.field !== 'ErrorDetail') {
          const cellValue = this.form.get(`${i}_${header.field}`)?.value;
          transformedRow[header.field] = cellValue;
        }
      });

      transformedData.push(transformedRow);
    }
    const AccountDetail = {
      ClientId: this.ClientId,
      ClientAccountDetail: transformedData,
      DeletedId: this.deletedRowId
    };
    if (this.form.valid) {
      this.service
        .SaveClientAccount(AccountDetail)
        .subscribe((response: ApiResponse) => {
          this.spinner.hide();
          if (response && response.ResponseStatus === 'Success') {
            this.data = response.ResponseData;
            if (this.data.length > 0) {
              this.initializeForm();
            }
            if (this.data.length === 0) {
              this.qbobuttons = true;
            }
          } else if (response.ResponseStatus === 'Failure') {
            this.toastr.error(response.ErrorData.Error);
          }
        });
    } else {
      this.spinner.hide();
      this.toastr.warning('Please Fill All Field');
    }
  }

  isFieldWithError(row: TableData, field: string) {
    const errorDetail = row['ErrorDetail'];

    if (
      errorDetail === 'AccountSubType not match' &&
      field === 'accountsubtype'
    ) {
      return true;
    }
    if (errorDetail === 'AccountType not match' && field === 'accounttype') {
      return true;
    }
    if (errorDetail === 'Duplicate Name Exists Error' && field == 'name') {
      return true;
    }
    return false;
  }
  //#endregion

  ButtonHideShow() {
    this.showUploadButton = JSON.parse(localStorage.getItem('showUploadButton') || 'false');
  }

}
