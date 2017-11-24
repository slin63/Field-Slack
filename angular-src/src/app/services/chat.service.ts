import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment'
import * as io from 'socket.io-client';


@Injectable()
export class ChatService {
  private url = environment.api_url;
  private socket: any;

  constructor() {
    console.log(this.url);
    this.socket = io(this.url);
  }
}
