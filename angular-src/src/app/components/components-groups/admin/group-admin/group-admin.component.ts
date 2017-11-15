import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

import { Roles, roleDict } from '../../../../constants/constants';
import { UsergroupService } from '../../../../services/usergroup.service';
import { AuthService } from '../../../../services/auth.service';


@Component({
  selector: 'app-group-admin',
  templateUrl: './group-admin.component.html',
  styleUrls: ['./group-admin.component.css']
})
export class GroupAdminComponent implements OnInit {
  userGroupCode: String;
  userGroup: any;

  user: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userGroupService: UsergroupService,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.userGroupCode = localStorage.getItem('user_group_code');
    this.userGroup = JSON.parse(localStorage.getItem('user_group'));
  }

}
