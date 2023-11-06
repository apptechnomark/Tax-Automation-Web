import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api/api.service';

@Component({
  selector: 'app-company',
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.scss']
})
export class CompanyComponent implements OnInit {
  constructor(private _service: ApiService) {

  }
  ngOnInit(): void {
    
  }
  QboConnect(){
    this._service.QboConnection();
}
}
