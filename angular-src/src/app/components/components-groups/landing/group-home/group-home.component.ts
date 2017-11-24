import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import 'rxjs/add/operator/switchMap';

import { Roles, roleDict } from '../../../../constants/constants';
import { UsergroupService } from '../../../../services/usergroup.service';
import { AuthService } from '../../../../services/auth.service';
import { ChannelsService } from 'app/services/channels.service';

@Component({
  selector: 'app-group-home',
  templateUrl: './group-home.component.html',
  styleUrls: ['./group-home.component.css']
})
export class GroupHomeComponent implements OnInit {
  userGroupCode: String;
  userGroup: any;

  channels: any[];
  currentChannel: any;

  user: any;
  userRole: Roles;
  userRoleString: String;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userGroupService: UsergroupService,
    private authService: AuthService,
    private channelsService: ChannelsService
  ) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.userGroupCode = params.user_group_code;
      // console.log(params.user_group_code);

      this.userGroupService.getUserGroupByUserGroupCode(this.userGroupCode)
      .subscribe(res => {
        this.userGroup = res.user_group;

        // Get the user and find out what their role is
        this.user = JSON.parse(localStorage.getItem('user'));
        this._setUserRole(this.userGroup, this.user.id);

        // Set the local storage.
        this.userGroupService.setLocalStorageToUsergroup(this.userGroupCode, this.userGroup);
        
        this.channelsService.getChannelsByUserGroupCode(this.userGroupCode)
          .subscribe(res => {
            if (res.success) {
              this.channels = res.channels;
              // console.log(res);
            }
          });
      });
    });
  }

  onSelectChannel(channel: any) {
    this.currentChannel = channel;
  }

  _setUserRole(userGroup, userID: String): void {
    this.userRole = this.userGroupService.getUserRole(this.userGroup, this.user.id);
    this.userRoleString = this.userGroupService.roleAsString(this.userRole);
  }

  _userIsAdmin(): boolean {
    return (this.userRole === Roles.admin);
  }
}

