import { Component, OnInit } from '@angular/core';

import { UsergroupService } from '../../../services/usergroup.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  usergroups: any[];

  constructor(
    private usergroupService: UsergroupService
  ) { }

  ngOnInit() {
    this.usergroupService.getUserGroups().subscribe(res => {
      this.usergroups = res.user_groups;
      // console.log(this.usergroups);
    },
    err => {
      console.log(err);
      return false;
    });


  }

}
