import { Component, OnInit, Input } from '@angular/core';

import { UsergroupService } from '../../../../../services/usergroup.service';
import { AuthService } from '../../../../../services/auth.service';

@Component({
  selector: 'app-channels-mgmt',
  templateUrl: './channels-mgmt.component.html',
  styleUrls: ['./channels-mgmt.component.css']
})
export class ChannelsMgmtComponent implements OnInit {
  channels: any[];
  userGroupCode: String;
  userGroup: Object;

  constructor(
    private userGroupService: UsergroupService
  ) { }

  ngOnInit() {
    this.userGroupCode = localStorage.getItem('user_group_code');
    this.userGroup = JSON.parse(localStorage.getItem('user_group'));

    this.userGroupService.getUserGroupChannels(this.userGroupCode)
    .subscribe(res => {
      this.channels = res.channels;
      console.log(res);
    });
  }

}
