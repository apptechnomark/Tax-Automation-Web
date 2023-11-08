import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/services/api/api.service';
import { ApiResponse, QboDataModel, qboDetail } from 'src/global';

@Component({
  selector: 'app-qbohome',
  templateUrl: './qbohome.component.html',
  styleUrls: ['./qbohome.component.scss']
})
export class QbohomeComponent implements OnInit {

  constructor(private route: ActivatedRoute, private _service: ApiService, private toastr: ToastrService, private router: Router){
   this.GetqboDeatils();
  }
  ngOnInit(): void {
    
  }

  GetqboDeatils(){
      this.route.queryParams.subscribe((params:qboDetail) => {
        const code = params.code;
        const state = params.state;
        const realmId = params.realmId;
        
        const qboDetail:qboDetail = {
          code : code,
          state : state,
          realmId : realmId 
        }
        console.log(qboDetail);
        localStorage.setItem('qboDetail', JSON.stringify(qboDetail));
        if(code != "" || code != null){
          this._service.GetQboToken(qboDetail).subscribe((res : ApiResponse) =>{
            console.log (res);
            if(res && res.ResponseStatus === "Success"){
              let QboData : QboDataModel = {
                id : res.ResponseData.id,
                access_token : res.ResponseData.access_token,
                qbo_accountname : res.ResponseData.qbo_accountname,
                token_expiry : res.ResponseData.token_expiry
              } 
              localStorage.setItem('qboData', JSON.stringify(QboData));
              this.toastr.success("Company Conected!")
              this.router.navigate(['/main'])
            } else if(res.ResponseStatus === "Failure"){
              this.toastr.error(res.ErrorData.Message);
            }
          })
        }
      });
  }
  }

