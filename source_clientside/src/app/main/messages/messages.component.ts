import { Component, OnInit, ElementRef, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { DOCUMENT } from '@angular/common';
import { AppUsers } from './../../login/shared/login.model';
import { LoginService } from '../../_core/services/login.service';
import { MatDialog } from '@angular/material/dialog';
import { UserProfile } from '../../_core/data-repository/profile'
import { UriHandler } from 'src/app/_helpers/uri-handler';
import { TimelineUrl } from 'src/app/_helpers/get-timeline-url';
import { ChatBoxResponse } from 'src/app/_core/models/models.response/ChatBoxResponse';
import { ChattingService } from 'src/app/_core/services/chatting.service';
import { SystemConstants } from 'src/app/_core/common/system.constants';
import { MessageUnit } from 'src/app/_core/models/models.response/MessageUnit';
import { UpdateChatBoxContentRequest } from 'src/app/_core/models/models.request/UpdateChatBoxContentRequest';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit {

  public appUsers: AppUsers;
  public chatBoxData: Map<string, ChatBoxResponse>;
  public displayedContent: any[]
  public displayedChatBoxId: string;
  public friends: {
    Id: string,
    Name: string,
    avarThumb: string
  }[]
  private userId: string;

  constructor(private router: Router, private elementRef: ElementRef, @Inject(DOCUMENT) private doc, private service: LoginService, public dialog: MatDialog,
    public uriHandler: UriHandler, public timelineurl: TimelineUrl, private chatService: ChattingService) {
    this.chatBoxData = new Map<string, ChatBoxResponse>();
  }

  async ngOnInit() {
    var script = document.createElement("script");
    script.type = "text/javascript";
    script.src = "../assets/js/script.js";
    this.elementRef.nativeElement.appendChild(script);

    this.userId = sessionStorage.getItem(SystemConstants.USERID_KEY);
    this.loadFriendData();
  }

  returnId() {
    UserProfile.IdTemp = this.service.getUserIdStorage()
  }

  loadFriendData() {
    this.chatService.getFriendDataById().subscribe(jsonData => {
      this.friends = jsonData.friendJsonString
    });
  }

  loadChatBoxById(theOtherId: string) {
    if (!this.chatBoxData.has(theOtherId)) {
      this.chatService.loadChatBox(this.userId, theOtherId).subscribe(
        (res: any) => {
          this.chatBoxData.set(theOtherId, { chatBoxId: res.chatBoxId, chatContentJson: JSON.parse(res.chatContentJson) });
          this.displayedContent = [];
          for (let item of this.chatBoxData.get(theOtherId).chatContentJson) {
            this.displayedContent.push(item);
          }
          this.displayedChatBoxId = res.chatBoxId;
        }
      );
    } else {
      this.displayedContent = [];
      for (let item of this.chatBoxData.get(theOtherId).chatContentJson) {
        this.displayedContent.push(item);
        this.displayedChatBoxId = this.chatBoxData.get(theOtherId).chatBoxId;
      }
    }
  }

  submitMessage(data: string) {
    var OLEAD: number;
    const request: UpdateChatBoxContentRequest = {
      ChatBoxId : this.displayedChatBoxId,
      UserId : this.userId,
      Message : data,
      OLEAD : OLEAD
    }

    //TODO: send request to api server
  }

  OnFriendListItemClicked(theOtherId: string) {
    this.loadChatBoxById(theOtherId);
  }

  private getCurrentOLEAD(){
  }
}
