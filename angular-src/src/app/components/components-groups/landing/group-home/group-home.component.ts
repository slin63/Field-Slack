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

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userGroupService: UsergroupService;
  ) { }

  ngOnInit() {
    this.userGroupCode = this.route.paramMap
      .switchmap((params: ParamMap) => {
        this.userGroupService.getUserGroup(params.get('user_group_code'));
      });
  }

}
