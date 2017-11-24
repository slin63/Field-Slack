import { Component, OnInit, Input, OnChanges } from '@angular/core';

import { ChatService } from 'app/services/chat.service';
import { AuthService } from 'app/services/auth.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {
  @Input() channel: any;

  userGroupCode: String;
  userGroup: any;
  user: any;

  message: string;
  messages: any;
  // [{ channel_id: [{ messages }]}]

  constructor(
    private chatService: ChatService,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.userGroupCode = localStorage.getItem('user_group_code');
    this.userGroup = JSON.parse(localStorage.getItem('user_group'));
    this.user = JSON.parse(localStorage.getItem('user'));

    // We need to make this.messages point to the previous messages that the channel has later.
    this.messages = {};
    this.chatService
      .getMessagesFromSocket()
      .subscribe((messageBody) => {
        console.log('NEW MESSAGE');
        this._assignMessageToChannel(messageBody);
        // this.messages.push(message);
      });
  }

  // Assigns a message to its appropriate channel in this.messages.
  private _assignMessageToChannel(messageBody) {
    const message = {
      user_name: messageBody.user_name,
      timestamp: messageBody.timestamp,
      content: messageBody.content
    }
    if (this._channelIDInChannelJSON(messageBody.channel_id)) {
      this.messages[messageBody.channel_id].push(message);
      console.log('found');
    } else {
      this.messages[messageBody.channel_id] = [message];
      console.log('not found');
    }

    console.log(this.messages);
  }

  // https://stackoverflow.com/questions/684672/how-do-i-loop-through-or-enumerate-a-javascript-object
  private _channelIDInChannelJSON(channelID): boolean {
    console.log('SEARCHING FOR CHANNEL ID IN THIS.MESSAGES');
    console.log(this.messages);
    console.log(channelID);
    for (const ID of Object.keys(this.messages)) {
      if (ID === channelID) {
        return true;
      }
    }
    return false; 
  }

  sendMessage() {
    const messageBody = {
      user_group_code: this.userGroupCode,
      user_name: this.user.username,
      channel_id: this.channel._id,
      timestamp: new Date(),
      content: this.message
    };

    console.log(messageBody);

    this.message = '';

    // Need to update chat.service to get all previous messages
    this.chatService.sendMessage(this.channel._id, messageBody)
    .subscribe(res => {
      if (res.success) {
        console.log('Successfully added message');
      } else {
        console.log('Failed to add message');
      }
    });
  }

  // Called on changes to module @input()s.
  ngOnChanges(changes: {[propKey: string]: any}) {
    if (this.channel) {
      this._initMessagesForChannel();
    }
    // If we haven't already initialized the message cache for this channel
    // if (!(this._channelIDInChannelJSON(this.channel._id)) && (this.channel != null)) {
    //   this._initMessagesForChannel();
    // }
    // let log: string[] = [];
    // for (let propName in changes) {
    //   let changedProp = changes[propName];
    //   let to = JSON.stringify(changedProp.currentValue);
    //   if (changedProp.isFirstChange()) {
    //     log.push(`Initial value of ${propName} set to ${to}`);
    //   } else {
    //     let from = JSON.stringify(changedProp.previousValue);
    //     log.push(`${propName} changed from ${from} to ${to}`);
    //   }
    // }
    // console.log(log);
  }

  private _initMessagesForChannel() {
    this.messages[this.channel._id] = this.channel.messages;
    console.log('CALLED INIT MESSAGES FOR CHANNEL');
    console.log(this.messages);
  }

}
