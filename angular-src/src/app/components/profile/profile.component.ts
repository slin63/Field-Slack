import { Component, OnInit } from '@angular/core';

import { LocalService } from '../../services/local.service';
import { AuthService } from '../../services/auth.service';
import { ValidateService } from '../../services/validate.service';
import { Router } from '@angular/router';

import { FlashMessagesService } from 'angular2-flash-messages';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  user: Object;

  constructor(
    private authService: AuthService,
    private router: Router,
    private flashMessage: FlashMessagesService,
    private validateService: ValidateService,
    private localService: LocalService
  ) { }

  ngOnInit() {
    this.authService.getProfile().subscribe(profile => {
      // const profileUser = {
      //   email: profile.email,
      //   name: profile.name,
      //   username: profile.username
      // };
      // debugger;

      // console.log(profileUser);
      
      // this.user = profileUser;
      this.user = profile.user;
    },
    err => {
      console.log(err);
      return false;
    });
  }

};
