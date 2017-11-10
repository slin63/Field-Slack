import { Component, OnInit } from '@angular/core';

import { AuthService } from '../../../services/auth.service';
import { UsergroupService } from '../../../services/usergroup.service';
import { FlashMessagesService } from 'angular2-flash-messages';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  // Usergroups for the user
  usergroups: any[];
  user: Object;

  // Form fields: Creation, joining
  name: String;
  description: String;
  private: boolean;

  userGroupCode: String;

  // Page view controllers
  viewGroupControlsButton: boolean;
  viewGroupControls: boolean;
  viewGroups: boolean;

  constructor(
    private usergroupService: UsergroupService,
    private flashMessage: FlashMessagesService,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.refreshGroupMenu();
    this.user = this.authService.getUser();
  }

  refreshGroupMenu() {
    this.viewGroupControls = false;
    this.viewGroups = true;

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

  // Create a group and add the user who created to it as an admin
  onJoinGroupSubmit() {
    this.usergroupService.joinUserGroup(this.userGroupCode).subscribe((res) => {
      if (res.success) {
        const successMessage = 'Successfuly joined group!';
        this.flashMessage.show(successMessage, {cssClass: 'alert-success', timeout: 3000});

        // Refresh the view so they can see the pretty new group they joined.
        this.refreshGroupMenu(); 
      } else {
        const failureMessage = 'Failed to join group. Are you already a member?';
        this.flashMessage.show(failureMessage, {cssClass: 'alert-danger', timeout: 3000});
      }
    });
  }
  
  onCreateGroupSubmit() {
    console.log("onCreateGroup");
    this.usergroupService.createUserGroup(this.name, this.description, this.private).subscribe((res) => {
      if (res.success) {
        const successMessage = 'Successfuly created ' + this.name + '!';
        this.flashMessage.show(successMessage, {cssClass: 'alert-success', timeout: 3000});

        // Refresh the view so they can see the pretty new group they joined.
        this.refreshGroupMenu(); 
      } else {
        const failureMessage = 'A group with the same name already exists. Try again.';
        this.flashMessage.show(failureMessage, {cssClass: 'alert-danger', timeout: 3000});
      }
    });
  }

  onViewGroupControlsClick() {
    this.viewGroups = !this.viewGroups;
    this.viewGroupControls = !this.viewGroupControls;
  }

}
