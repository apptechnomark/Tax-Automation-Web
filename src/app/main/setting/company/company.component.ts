import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/services/api/api.service';
import { ActionButton, TableColumn, TableData } from 'src/app/shared/table/table.component';
import { ApiResponse, CompanyFilter} from 'src/global';

@Component({
  selector: 'app-company',
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.scss']
})
export class CompanyComponent implements OnInit {
  tableData: TableData[];
  tableColumns: TableColumn[] = [
    { header: 'Company', field: 'CompanyName' },
    { header: 'Status', field: 'IsActive' }
  ];
  TotalCount: number;
  
  ActionButtons: ActionButton[] = [
    { lable: "Customer", Action: 'AddCustomer' },
    { lable: "Vendor", Action: 'AddVendor' },
  ]

  constructor(private service: ApiService,private toastr:ToastrService,  private spinner: NgxSpinnerService,) {
  }
  ngOnInit(): void {
    this.companyList();
  }
  QboConnect(){
    this.service.QboConnection();
  }

  companyList(){
    const Filter:CompanyFilter = {
      PageNo : 1,
      PageSize: 100,
      GlobalFilter : null,
      SortColumn : null,
      IsDesc : false,
      IsActive: null
    } 
    this.spinner.show();
    this.service.GetCompanyList(Filter).subscribe((res:ApiResponse) => {
      this.spinner.hide();
      console.log(res);
      if(res && res.ResponseStatus === "Success"){
        this.tableData = res.ResponseData.List;
        this.TotalCount = res.ResponseData.TotalCount;
      } else if(res.ResponseStatus === "Failure"){
        this.toastr.error(res.ErrorData.Message);
      }
    })
  }

  handleActionClick(event: { action: string, data: any }) {
    const { action, data } = event;
    // Add more conditions for other actions if needed
  }

}
