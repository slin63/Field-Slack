import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { environment } from '../../environments/environment';

@Injectable()
export class ChannelsService {

  constructor(
    private http: Http
  ) { }

  createChannel(name: String, description: String, userGroupCode: String) {
    const headers = this._getAuthHeader();
    const data = {
      name: name,
      description: description,
      user_group_code: userGroupCode,
      messages: []
    };

    return this.http.post(
      environment.api_url + 'channels',
      data,
      { headers: headers })
      .map(res => res.json());
    }

  getChannelByID(channelID: String) {
    const headers = this._getAuthHeader();
    const data = {
      channel_id: channelID
    };
    const config = {
      params: data,
      headers: headers
    };

    return this.http.get(
      environment.api_url + 'channels',
      config
    ).map(res => res.json());
  }

  getChannelsByUserGroupCode(userGroupCode: String) {
    const headers = this._getAuthHeader();
    const data = {
      user_group_code: userGroupCode
    };
    const config = {
      params: data,
      headers: headers
    };

    return this.http.get(
      environment.api_url + 'channels/usergroup',
      config
    ).map(res => res.json());
  }

  updateChannel(channelID: String, editedChannel: any) {
    const headers = this._getAuthHeader();
    const data = {
      channel_id: channelID,
      channel_edits: editedChannel
    }

    return this.http.put(
      environment.api_url + 'channels',
      data,
      { headers: headers })
      .map(res => res.json());
  }

  deleteChannel(userGroupCode: String, channelID: String) {
    const headers = this._getAuthHeader();
    const data = {
      user_group_code: userGroupCode,
      channel_id: channelID
    };
    const config = {
      params: data,
      headers: headers
    };

    return this.http.delete(
      environment.api_url + 'channels',
      config
    ).map(res => res.json());
  }

  _getAuthHeader(): Headers {
    const headers = new Headers();
    const token = localStorage.getItem('id_token');

    headers.append('Authorization', token);
    headers.append('Content-Type', 'application/json');

    return headers;
  }
}
