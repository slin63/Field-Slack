import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  loginView: boolean;
  registerView: boolean;

  constructor() { }

  ngOnInit() {
  }

  onLoginClick() {
    console.log('login clicked');
    this.loginView = !this.loginView;
    this.registerView = false;
  }

  onRegisterClick() {
    console.log('register clicked');
    this.registerView = !this.registerView;
    this.loginView = false;
  }

}
