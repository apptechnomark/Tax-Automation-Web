import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from 'src/app/services/api/api.service';
import { qboDetail } from 'src/global';

@Component({
  selector: 'app-qbohome',
  templateUrl: './qbohome.component.html',
  styleUrls: ['./qbohome.component.scss']
})
export class QbohomeComponent implements OnInit {

  constructor(private route: ActivatedRoute, private _service: ApiService){
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
          this._service.GetQboToken(qboDetail).subscribe(res =>{
            console.log(res);
          })
        }
      });
  }
  }

