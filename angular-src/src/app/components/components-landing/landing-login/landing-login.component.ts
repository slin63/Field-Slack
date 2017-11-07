import { Component, OnInit } from '@angular/core';

import { AuthService } from '../../../services/auth.service';
import { ValidateService } from '../../../services/validate.service';
import { Router } from '@angular/router';

import { FlashMessagesService } from 'angular2-flash-messages';

@Component({
  selector: 'app-landing-login',
  templateUrl: './landing-login.component.html',
  styleUrls: ['./landing-login.component.css']
})
export class LandingLoginComponent implements OnInit {
  name: String;
  username: String;
  email: String;
  password: String;

  login: boolean;
  register: boolean;

  constructor(
    private authService: AuthService,
    private router: Router,
    private flashMessage: FlashMessagesService,
    private validateService: ValidateService
  ) { };

  ngOnInit() {
    this.login = true;
    this.register = false;
  }

  onLoginSubmit() {
    const user = {
      username: this.username,
      password: this.password
    }

    // This service is an observable so we must "subcribe" to it.
    this.authService.authenticateUser(user).subscribe(data => {
      console.log(data);
      if (data.success) {
        this.flashMessage.show('You\'re logged in.', {cssClass: 'alert-success', timeout: 3000});
        this.authService.storeUserData(data.token, data.user);
        this.router.navigate(['/dashboard']);
      } else {
        this.flashMessage.show('Incorrect password / username.', {cssClass: 'alert-danger', timeout: 3000});
      }
    });
  }

  

  onRegisterSubmit() {
    const user = {
      name: this.name,
      username: this.username,
      email: this.email,
      password: this.password
    };

    const validForm = this.validateService.validateRegister(user);
    const validEmail = this.validateService.validateEmail(user.email);
    // Required Fields
    if (!validForm) {
      this.flashMessage.show('Incomplete registration form!',
        {cssClass: 'alert-danger', timeout: 3000});
      return false;
    }

    // Validate Email
    if (!validEmail) {
      this.flashMessage.show('Invalid Email!',
        {cssClass: 'alert-danger', timeout: 3000});
      return false;
    }

    // Actually register the user
    // This service is an observable so we must "subcribe" to it.
    this.authService.registerUser(user).subscribe(data => {
      // Tell the user they've succeeded and bring them to the login page.
      if (data.success) {
        this.flashMessage.show('You\'re registered.',
          {cssClass: 'alert-success', timeout: 3000});
        this.router.navigate(['']);
      } else {
        this.flashMessage.show('Something goofed.',
          {cssClass: 'alert-danger', timeout: 3000});
      }
    });

    this._toggleRegisterLogin(this.username);
  }

  _toggleRegisterLogin(username: String) {
    this.login = !this.login;
    this.register = !this.register;

    this.username = username;
  }

}
