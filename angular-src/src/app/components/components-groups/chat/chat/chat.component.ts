import { Component, OnInit, Input, OnChanges } from '@angular/core';

import { ChatService } from 'app/services/chat.service';
import { AuthService } from 'app/services/auth.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit, OnChanges {
  @Input() channel: any;

  userGroupCode: String;
  userGroup: any;
  user: any;

  searchString: string;

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
      });
  }

  sendMessage() {
    if (this.message === '') {
      return false;
    }
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

        console.log('SCROLLED TO BOTTOM');
        this._scrollToBottom();
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
  }

  public onSearchBox() {
    console.log('SEARCHING FOR: ' + this.searchString);
    this.chatService.findMessageByString(this.channel._id, this.searchString).subscribe(res => {
      if (res.success) {
        console.log('GOT:');
        console.log(res.messages);
      } else {
        console.log('Failed');
      }
    });
  }

  private _scrollToBottom() {
    const chatbox = document.getElementById('message-window');
    if (chatbox != null) {
      setTimeout(() => {chatbox.scrollTop = chatbox.scrollHeight}, 100);
    }
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

    console.log('SCROLLED TO BOTTOM');
    this._scrollToBottom();

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

  private _initMessagesForChannel() {
    this.messages[this.channel._id] = this.channel.messages;
    console.log('CALLED INIT MESSAGES FOR CHANNEL');
    console.log(this.messages);

    console.log('SCROLLED TO BOTTOM');
    this._scrollToBottom();
  }

}
