import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-setting',
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.scss']
})
export class SettingComponent implements OnInit {
  role :any;
  constructor(
    private router:Router,
  ) {
    this.routingMethos()
   }

  ngOnInit(): void {
  }
  routingMethos(){
    this.role = localStorage.getItem('Role');
    // if(this.role == "1")
    //   this.router.navigateByUrl[('**')]
  }

}
