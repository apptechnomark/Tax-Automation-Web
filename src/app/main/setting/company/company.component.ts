import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api/api.service';
import { TableColumn, TableData } from 'src/app/shared/table/table.component';

@Component({
  selector: 'app-company',
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.scss']
})
export class CompanyComponent implements OnInit {
  tableData: TableData[] = [{_id:"1",username: 'John',email:"john@gmail.com"}, {_id:"2",username: 'manam',email:"manam@gmail.com"}]
  tableColumns: TableColumn[] = [
    {header: 'Id', field:'_id'},
    { header: 'Username', field: 'username' },
    { header: 'Email', field: 'email' }
  ];
  
  constructor(private _service: ApiService) {

  }
  ngOnInit(): void {
    
  }
  QboConnect(){
    this._service.QboConnection();
}
}
