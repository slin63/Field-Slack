import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { environment } from '../../environments/environment';

import { tokenNotExpired } from 'angular2-jwt';

@Injectable()
export class UsergroupService {
  user: any;

  constructor(
    private http: Http
  ) { }

  // Get all a user's usergroups
  getUserGroups() {
    const headers = new Headers();
    const token = localStorage.getItem('id_token');

    headers.append('Authorization', token);
    headers.append('Content-Type', 'application/json');

    return this.http.get(environment.api_url + 'users/usergroups', {headers: headers}).map(res => res.json());
  }
}
