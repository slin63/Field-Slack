import { Component, OnInit } from '@angular/core';

import { ValidateService } from '../../../services/validate.service';
import { AuthService } from '../../../services/auth.service';
import { FlashMessagesService } from 'angular2-flash-messages';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})

export class RegisterComponent implements OnInit {
  name: String;
  username: String;
  email: String;
  password: String;

  // Inject services
  constructor(
    private validateService: ValidateService,
    private flashMessage: FlashMessagesService,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
  }

  // Requires a validation service
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
        this.router.navigate(['/login']);
      } else {
        this.flashMessage.show('Something goofed.',
          {cssClass: 'alert-danger', timeout: 3000});
      }
    })
  }

}
