import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-pagenot-found',
  templateUrl: './pagenot-found.component.html',
  styleUrls: ['./pagenot-found.component.scss']
})
export class PagenotFoundComponent implements OnInit {
  role :any;
  token :any;
  constructor(
    private router:Router,
  ) {}

  ngOnInit(): void {
    this.role = localStorage.getItem('Role');
    this.token = localStorage.getItem('token');
  }

  HomeButton(){
    if(this.role == "1" && this.token)
      this.router.navigateByUrl('/main');
    else if (this.role == "2" && this.token)
      this.router.navigateByUrl('/main/setting');
    else 
      this.router.navigateByUrl('/login');
  }
}
