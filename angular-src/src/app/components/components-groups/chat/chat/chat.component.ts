import { Component, OnInit, Input, OnChanges } from '@angular/core';

import { ChatService } from 'app/services/chat.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {
  @Input() channel: any;

  userGroupCode: String;
  userGroup: any;

  message: string;
  messages: string[];

  constructor(
    private chatService: ChatService
  ) { }

  ngOnInit() {
    this.userGroupCode = localStorage.getItem('user_group_code');
    this.userGroup = JSON.parse(localStorage.getItem('user_group'));

    // We need to make this.messages point to the previous messages that the channel has later.
    this.messages = [];
    this.chatService
      .getMessages()
      .subscribe((message: string) => {
        console.log("NEW MESSAGE");
        this.messages.push(message);
      });
  }

  sendMessage() {
    const messageBody = {
      user_group_code: this.userGroupCode,
      channel_id: this.channel._id,
      time: new Date(),
      content: this.message
    };

    // Need to update chat.service to 
    this.chatService.sendMessage(messageBody);
    this.message = '';
  }

  // Called on changes to module @input()s.
  ngOnChanges(changes: {[propKey: string]: any}) {
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

}
