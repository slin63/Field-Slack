import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { environment } from '../../environments/environment';
import { Roles, roleDict } from '../constants/constants';

import { tokenNotExpired } from 'angular2-jwt';

@Injectable()
export class UsergroupService {
  user: any;

  constructor(
    private http: Http
  ) { }

  // Get all a user's usergroups
  getUserGroups() {
    const headers = this._getAuthHeader();

    return this.http.get(
      environment.api_url + 'users/usergroups', 
      { headers: headers })
      .map(res => res.json());
  }

  getUserGroupByUserGroupCode(userGroupCode: String) {
    const headers = this._getAuthHeader();
    const data = {
      user_group_code: userGroupCode
    };
    const config = {
      params: data,
      headers: headers
    };

    return this.http.get(
      environment.api_url + 'usergroups/usergroup',
      config
    ).map(res => res.json());
  }

  createUserGroup(name: String, description: String, is_private = false) {
    const headers = this._getAuthHeader();
    const data = {
      name: name,
      description: description,
      is_private: is_private
    }

    return this.http.post(
      environment.api_url + 'usergroups/create',
      data,
      { headers: headers })
      .map(res => res.json());
  }

  joinUserGroup(userGroupCode: String, role = 'standard') {
    const headers = this._getAuthHeader();
    const data = { // Becomes req.body in the POST 
      user_group_code: userGroupCode,
      role: role
    };

    return this.http.post(
      environment.api_url + 'usergroups/join',
      data, 
      { headers: headers })
      .map(res => res.json());
  }

  roleAsString(role: Roles): String {
    return Roles[role];
  }

  getUserRole(userGroup, userID): Roles {
    for (const user of userGroup.users) {
      if (user.userID === userID) {
        const roleEnum = roleDict[user.role];
        return roleEnum;
      }
    }
    return null;
  }

  _getAuthHeader(): Headers {
    const headers = new Headers();
    const token = localStorage.getItem('id_token');

    headers.append('Authorization', token);
    headers.append('Content-Type', 'application/json');

    return headers;
  }

}

