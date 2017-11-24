import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { environment } from '../../environments/environment'
import { Observable } from 'rxjs/Observable';

import * as io from 'socket.io-client';

// https://codingblast.com/chat-application-angular-socket-io/
@Injectable()
export class ChatService {
  private url = environment.api_url;
  private socket: any;

  constructor(
    private http: Http
  ) {
    console.log(this.url);
    this.socket = io(this.url);
  }

  public sendMessage(channelID, messageBody) {
    // Notify the world that we've got a new message
    this.socket.emit('new-message', messageBody);

    const headers = this._getAuthHeader();
    const data = {
      channel_id: channelID,
      new_message: messageBody
    }

    return this.http.post(
      environment.api_url + 'channels/messages',
      data,
      { headers: headers })
      .map(res => res.json());
  }

  public getMessagesFromSocket = () => {
    return Observable.create((observer) => {
      this.socket.on('new-message', (messageBody) => {
        observer.next(messageBody);
      });
    });
  }

  private _getAuthHeader(): Headers {
    const headers = new Headers();
    const token = localStorage.getItem('id_token');

    headers.append('Authorization', token);
    headers.append('Content-Type', 'application/json');

    return headers;
  }
}
