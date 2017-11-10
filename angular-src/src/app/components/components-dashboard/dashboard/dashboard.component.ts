import { Component, OnInit } from '@angular/core';

import { UsergroupService } from '../../../services/usergroup.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  usergroups: any[];

  viewGroupControlsButton: boolean;
  viewGroupControls: boolean;
  viewGroups: boolean;

  constructor(
    private usergroupService: UsergroupService
  ) { }

  ngOnInit() {
    this.initializeGroupMenu();
  }

  initializeGroupMenu() {
    this.usergroupService.getUserGroups().subscribe(res => {
      this.usergroups = res.user_groups;

      // No groups? Just show the registration tab
      if (this.usergroups.length === 0) {
        this.viewGroups = false;
        this.viewGroupControls = true;
      } 
      // We have groups? Show the groups and let the users choose to see the group registration/creation tab
      else {
        this.viewGroupControlsButton = true;
        this.viewGroups = true;
      }
    },
    err => {
      console.log(err);
      return false;
    });
  }

  onViewGroupControlsClick() {
    this.viewGroups = !this.viewGroups;
    this.viewGroupControls = !this.viewGroupControls;
  }

}
