import { Component, OnInit, } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/services/api/api.service';
import { ApiResponse, qboDetail } from 'src/global';
@Component({
  selector: 'app-qbohome',
  templateUrl: './qbohome.component.html',
  styleUrls: ['./qbohome.component.scss']
})
export class QbohomeComponent implements OnInit {

  constructor(private route: ActivatedRoute, private _service: ApiService, private toastr: ToastrService, private router: Router) {
    this.GetqboDeatils();
  }
  ngOnInit(): void {  }

  GetqboDeatils() {
    this.route.queryParams.subscribe((params: any) => {
      const error = params?.error

      if (error) {
        this.router.navigate(['/main/setting/company'])
        this.toastr.error("Company Connection Failed")
      } else {
        const code = params?.code;
        const state = params?.state;
        const realmId = params?.realmId;

        const qboDetail: qboDetail = {
          code: code,
          state: state,
          realmId: realmId
        }
        localStorage.setItem('qboDetail', JSON.stringify(qboDetail));
        if (code != "" || code != null) {
          this._service.GetQboToken(qboDetail).subscribe((res: ApiResponse) => {
            if (res && res.ResponseStatus === "Success") {
              this.toastr.success("Company Conected!")
              this.router.navigate(['/main/setting/company'])
            } else if (res.ResponseStatus === "Failure") {
              this.toastr.error(res.ErrorData.Message);
            }
          })
        }
      }
    });
  }
}

