import { Component, OnInit } from '@angular/core';
import { environment } from '../../../../environments/environment';

import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  loginView: boolean;
  registerView: boolean;
  gitURL: String;

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
    // If the user's logged in, send them to their dashboard
    if (this.authService.loggedIn()) {
      this.router.navigate(['/dashboard']);
    }
    this.gitURL = environment.git_url;
  }

  onLoginClick() {
    this.loginView = !this.loginView;
    this.registerView = false;
  }

  onRegisterClick() {
    this.registerView = !this.registerView;
    this.loginView = false;
  }

}
