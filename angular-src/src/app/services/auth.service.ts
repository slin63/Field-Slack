import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { environment } from '../../environments/environment';

import { tokenNotExpired } from 'angular2-jwt';

import 'rxjs/add/operator/map';

@Injectable()
export class AuthService {
  authToken: any;
  user: any;

  // Inject HTTP service
  constructor(
    private http: Http
  ) { }

  getUser() {
    return this.user;
  }

  // Registrations
  registerUser(user) {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');

    // Gets JSON response from backend by passing data given from frontend form
    return this.http.post(environment.api_url + 'users/register', user,
     {headers: headers}).map(res => res.json());
  }

  // Logins
  authenticateUser(user) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    // Gets JSON response from backend by passing data given from frontend form
    return this.http.post(environment.api_url + 'users/authenticate', user,
     {headers: headers}).map(res => res.json());
  }

  // Called if the user successfully logs in
  // Stores data in local storage
  storeUserData(token, user) {
    // Store token data and user JSON as localStorage
    localStorage.setItem('id_token', token);
    localStorage.setItem('user', JSON.stringify(user));

    // Assign the valid token as the auth token and save the user data.
    this.authToken = token;
    this.user = user;
  }

  // Logout
  logout() {
    this.authToken = null;
    this.user = null;
    localStorage.clear();
  }

  getProfile() {
    const headers = new Headers();
    this._loadToken();
    headers.append('Authorization', this.authToken);
    headers.append('Content-Type', 'application/json'); 

    const res =  this.http.get(environment.api_url + 'users/profile', 
      {headers: headers})
      .map(res => res.json());

    return res;
  }

  loggedIn() {
    return tokenNotExpired('id_token');
  }

  _loadToken() {
    const token = localStorage.getItem('id_token');
    this.authToken = token;
  }
}
