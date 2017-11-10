import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import 'rxjs/add/operator/switchMap';

import { UsergroupService } from '../../../../services/usergroup.service';

@Component({
  selector: 'app-group-home',
  templateUrl: './group-home.component.html',
  styleUrls: ['./group-home.component.css']
})
export class GroupHomeComponent implements OnInit {
  userGroupCode: String;
  userGroup: Object;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userGroupService: UsergroupService
  ) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.userGroupCode = params.user_group_code;
      console.log(params.user_group_code);

      this.userGroupService.getUserGroupByUserGroupCode(this.userGroupCode)
      .subscribe(res => {
        this.userGroup = res.user_group;
      });
    });

  }
}

