import { Component, OnInit, Input } from '@angular/core';

import { ChannelsService } from '../../../../../services/channels.service';
import { UsergroupService } from '../../../../../services/usergroup.service';
import { AuthService } from '../../../../../services/auth.service';
import { FlashMessagesService } from 'angular2-flash-messages/module/flash-messages.service';

@Component({
  selector: 'app-channels-mgmt',
  templateUrl: './channels-mgmt.component.html',
  styleUrls: ['./channels-mgmt.component.css']
})
export class ChannelsMgmtComponent implements OnInit {
  channels: any[];
  userGroupCode: String;
  userGroup: any;

  channelName: String;
  channelDescription: String;

  currentlyEditingID: String;

  constructor(
    private userGroupService: UsergroupService,
    private channelsService: ChannelsService,
    private flashMessage: FlashMessagesService
  ) { }

  ngOnInit() {
    this.userGroupCode = localStorage.getItem('user_group_code');
    this.userGroup = JSON.parse(localStorage.getItem('user_group'));

    this._refreshChannels();
  }

  onCreateChannelSubmit() {
    this.channelsService.createChannel(this.channelName, this.channelDescription, this.userGroupCode)
      .subscribe((res) => {
        if (res.success) {
          this.flashMessage.show('Channel created successfully!', {cssClass: 'alert-success', timeout: 3000});
          this._refreshChannels();
        } else {
          this.flashMessage.show(res.msg, {cssClass: 'alert-warning', timeout: 3000});
        }
      });
  }

  onDeleteChannelSubmit(channelID: String) {
    this.channelsService.deleteChannel(this.userGroupCode, channelID)
      .subscribe((res) => {
        this.flashMessage.show('Channel deleted successfully!', {cssClass: 'alert-success', timeout: 3000});
        this._refreshChannels();
      });
  }

  onEditChannelSubmit(name: any, description: any, channelID: String) {
    const editedChannel = {
      name: name.value,
      description: description.value
    }

    this.channelsService.updateChannel(channelID, editedChannel)
      .subscribe((res) => {
        this.flashMessage.show('Edits saved!', {cssClass: 'alert-success', timeout: 3000});
        this._refreshChannels();
      }, (err) => {
        throw err;
      });
  }

  onEditClick(channel: any) {
    if (this.currentlyEditingID === channel._id) {
      this.currentlyEditingID = null;
    } else {
      this.currentlyEditingID = channel._id;
    }
  }

  _refreshChannels() {
    // this.userGroupService.getUserGroupChannels(this.userGroupCode)
    // .subscribe(res => {
    //   this.channels = res.channels;
    //   this.currentlyEditingID = null;
    // });
    this.channelsService.getChannelsByUserGroupCode(this.userGroupCode)
    .subscribe(res => {
      this.channels = res.channels;
      this.currentlyEditingID = null;
    });
  }
}
