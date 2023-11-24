import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/services/api/api.service';
import { ApiResponse } from 'src/global';
import { HttpClient,  HttpResponse } from '@angular/common/http';
import * as XLSX from 'xlsx';
import { TableColumn, TableData } from 'src/app/shared/table/table.component';

declare var $: any;
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, AfterViewInit {
  data: TableData[] = [];
  IsClientField: boolean = true;
  headers: TableColumn[] = [
    { header: 'Id', field: 'Id' },
    { header: 'Name', field: 'name' },
    { header: 'Accoun Type', field: 'accounttype' },
    { header: 'Account Subtype', field: 'accountsubtype' },
    { header: 'Date', field: 'Date' },
    { header: 'Debit', field: 'debit' },
    { header: 'Credit', field: 'credit' },
    { header: 'Error', field: 'ErrorDetail' },
    { header: 'Action', field: 'action' },
  ];

  form!: FormGroup;
  client: any;
  qbobuttons : boolean = false;
  ClientId: number;

  @ViewChild('fileInput') fileInput: ElementRef;
  clientform: FormGroup = new FormGroup({
    Clientname: new FormControl(''),
    Password: new FormControl(''),
  });
  constructor(
    private builder: FormBuilder,
    private router: Router,
    private service: ApiService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService
  ) {}

  ngAfterViewInit(): void {
    $('[data-bs-toggle="tooltip"]').tooltip();
  }

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
    if(this.data.length > 0 ){
      this.initializeForm();
    }
    this.GetclientDetials();

    $('[data-bs-toggle="tooltip"]').tooltip();
  }

  GetclientDetials() {
    this.spinner.show();
    this.service.GetClient().subscribe((res:ApiResponse) => {
      this.spinner.hide();
      if (res && res.ResponseStatus === 'Success') {
        console.log(res.ResponseData[0]);
        
        if(res.ResponseData[0]?.clientUserMappings != null){
          console.log(res.ResponseData[0]?.clientUserMappings);
          this.IsClientField = false
          this.ClientId = res.ResponseData[0].clientUserMappings?.Id
          localStorage.setItem("clientId", String (this.ClientId))
          this.clientform.patchValue({
            Clientname: res.ResponseData[0].clientUserMappings?.ClientName,
            Year : res.ResponseData[0].clientUserMappings?.Year,
            FormType: res.ResponseData[0].clientUserMappings?.Formtype
          })
          console.log(this.clientform.value);
          this.clientform.controls?.['Clientname'].disable();
          this.clientform.controls?.['Year'].disable();
          this.clientform.controls?.['FormType'].disable();
        }
        if(res.ResponseData[0]?.clientAccountDetail){
          console.log(res.ResponseData[0]?.clientAccountDetail);
          
          this.data = res.ResponseData[0]?.clientAccountDetail
          if(this.data.length > 0 ) {
            this.initializeForm();
          }
          if(this.data.length === 0) {
            this.qbobuttons = true
          }
        }
      }
      else if (res.ResponseStatus === 'Failure') {
        this.toastr.error(res.ErrorData.Error);
        console.log("Message", res.Message, "Error", res.ErrorData.Error);
      }
    })
  }
  UploadData() {
    if (this.clientform.valid) {
      this.spinner.show();
      console.log("data", this.clientform)
      this.service.updateImportData(this.clientform.value).subscribe((response: ApiResponse) => {
        this.spinner.hide();
        if (response && response.ResponseStatus === 'Success') {
          this.ClientId = response.ResponseData
          localStorage.setItem("clientId", response.ResponseData)
          this.toastr.success("Client Detail Added");
          this.clientform.reset();
        }
        else if (response.ResponseStatus === 'Failure') {
          this.toastr.error(response.ErrorData.Error);
          console.log("Message", response.Message, "Error", response.ErrorData.Error);
        }
      })
    }
    else
      this.toastr.error("Invalid Form's Value")
  }

  get f(): { [key: string]: AbstractControl } {
    return this.clientform.controls;
  }

  ExportExcel() {
    const fileName = 'Export.xlsx';

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
        console.log(jsonData);
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
    console.log('Uploaded file', event.target);

    const file = event.target.files[0];
    this.uploadedFile = file;
  }

  uploadFile() {
    if (!this.uploadedFile) {
      this.toastr.error('Please select a file.');
      return;
    }

    const formData = new FormData();
    formData.append('file', this.uploadedFile);
    this.client = localStorage.getItem('clientId');
    console.log(this.client);
    this.service
      .ImportExcel(formData, this.client)
      .subscribe((response: any) => {
        this.spinner.hide();
        if (response && response.ResponseStatus === 'Success') {
          console.log(response.Message);
          this.data = response.ResponseData 
          if(this.data.length > 0 ) {
            this.initializeForm();
          }
          if(this.data.length === 0) {
            this.qbobuttons = true
          }
          console.log(response.ResponseData);
          
          this.toastr.success('File uploaded successfully');
          this.fileInput.nativeElement.value = '';
        } else if (response.ResponseStatus === 'Failure') {
          this.toastr.error(response.ErrorData.Error);
          console.log(
            'Message',
            response.Message,
            'Error',
            response.ErrorData.Error
          );
        }
      });
  }


  //#region Qbo Process
  AddtoQbo(){
    this.service.AddDataToQbo().subscribe((res:any) => {
      console.log(res)
      if (res && res.ResponseStatus === 'Success') {
        this.toastr.success("Data added successfully");
      }
      else if (res.ResponseStatus === 'Failure') {
        this.toastr.error(res.ErrorData.Error)
      }
    })
  }

  RevrseEntry(){
    this.service.ReversalEntry().subscribe((res:any) => {
      console.log(res)
      if (res && res.ResponseStatus === 'Success') {
        this.toastr.success("All Account has been Inactivated","Client Has Been Disconnected",);
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
        if (header.field === 'debit' || header.field === 'credit') {
          initialValue = parseFloat(initialValue).toFixed(2);
          console.log(initialValue)
        }
          formControls[`${rowIndex}_${header.field}`] = [
            initialValue,
            [Validators.required] 
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

    // Update the data array
    this.data[rowIndex][field] = event.target.value;
  }

  onDeleteRow(rowIndex: number): void {
    console.log(rowIndex);
    this.data.splice(rowIndex, 1);
    console.log(this.data);
    const currentFormValues = this.form.getRawValue();
    this.headers.forEach((item) => {
      delete currentFormValues[`${rowIndex}_${item.field}`];
    });
    console.log('curruntdata =>', currentFormValues);

    this.initializeForm();
    console.log(this.form.value);
  } 

  onSave() {
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
      ClientAccountDetail : transformedData
    }

    if(this.form.valid){
      this.service.SaveClientAccoutn(AccountDetail).subscribe((response: ApiResponse) => {
        this.spinner.hide();
        if (response && response.ResponseStatus === 'Success') {
          this.data = response.ResponseData 
          if(this.data.length > 0 ) {
            this.initializeForm();
          }
          if(this.data.length === 0) {
            this.qbobuttons = true
          }
        }
        else if (response.ResponseStatus === 'Failure') {
          this.toastr.error(response.ErrorData.Error);
          console.log("Message", response.Message, "Error", response.ErrorData.Error);
        }
      })
    } else {
      this.spinner.hide();
      this.toastr.warning("Please Fill All Field");
    }
    console.log(transformedData);
    
  }

  isFieldWithError(row: TableData, field: string): boolean {
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

    return false;
  }
  //#endregion
}
