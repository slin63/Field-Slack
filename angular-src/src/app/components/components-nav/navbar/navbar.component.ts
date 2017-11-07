import { Component, OnInit } from '@angular/core';

import { LocalService } from '../../../services/local.service';
import { AuthService } from '../../../services/auth.service';
import { ValidateService } from '../../../services/validate.service';
import { Router } from '@angular/router';

import { FlashMessagesService } from 'angular2-flash-messages';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  
  constructor(
    private authService: AuthService,
    private router: Router,
    private flashMessage: FlashMessagesService,
    private validateService: ValidateService,
    private localService: LocalService
  ) { }

  ngOnInit() {
  }

  loggedIn(): boolean {
    const loggedIn = !(this.localService.localStorageItem('user') === null);
    return loggedIn;
  }

  onLogoutClick() {
    this.authService.logout();
    this.flashMessage.show('Logged out.', {cssClass: 'alert-success', timeout: 3000});
    this.router.navigate(['/']);
    return false;
  }

}
