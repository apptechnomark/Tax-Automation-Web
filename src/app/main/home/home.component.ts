import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/services/api/api.service';
import { ApiResponse } from 'src/global';
import { HttpClient,  HttpResponse } from '@angular/common/http';
import * as XLSX from 'xlsx';

declare var $: any;
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, AfterViewInit {
  client :any;
  ClientId : number;
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
    private toastr: ToastrService,
  ) { }

  ngAfterViewInit(): void {
    $('[data-bs-toggle="tooltip"]').tooltip();
  }

  ngOnInit(): void {
    this.clientform = this.builder.group(
      {
        Clientname: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(50)]],
        Year: ['', [Validators.required]],
        FormType: ['', [Validators.required]],
      },
    );

    $('[data-bs-toggle="tooltip"]').tooltip();
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
          this.toastr.success("User created successful");
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
        const workbook: XLSX.WorkBook = XLSX.read(new Uint8Array(arrayBuffer), { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const excelData: XLSX.WorkSheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(excelData, { header: 1 });
        console.log(jsonData);
        const blob = new Blob([arrayBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      },
      error => {
        this.toastr.error("Failed to fetch Excel data.");
        console.error("Error fetching Excel data:", error);
      }
    );
  }

  uploadedFile:any;
 
  onFileChange(event: any) {
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
    this.client = localStorage.getItem("clientId")
    console.log(this.client);
    this.service.ImportExcel(formData,this.client).subscribe((response: any) => {
      this.spinner.hide();
      if (response && response.ResponseStatus === 'Success') {
        console.log(response.Message);
        this.toastr.success('File uploaded successfully');
        this.fileInput.nativeElement.value = '';
      } else if (response.ResponseStatus === 'Failure') {
        this.toastr.error(response.ErrorData.Error);
        console.log('Message', response.Message, 'Error', response.ErrorData.Error);
      }
    }
    );
  }
}
