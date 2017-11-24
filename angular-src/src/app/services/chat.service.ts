import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment'
import { Observable } from 'rxjs/Observable';

import * as io from 'socket.io-client';

// https://codingblast.com/chat-application-angular-socket-io/
@Injectable()
export class ChatService {
  private url = environment.api_url;
  private socket: any;

  constructor() {
    console.log(this.url);
    this.socket = io(this.url);
  }

  public sendMessage(message) {
    this.socket.emit('new-message', message);
  }

  public getMessages = () => {
    return Observable.create((observer) => {
      this.socket.on('new-message', (message) => {
        observer.next(message);
      });
    });
  }

}
