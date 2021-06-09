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
import { UpdateChatBoxContentResponse } from 'src/app/_core/models/models.response/UpdateChatBoxContentResponse';
import { StaticWSMediator, SYS_TOKEN_DEF } from 'src/assets/js/websocket/WSMediator';


export interface ChatBoxData { TheOtherId: string, Data: ChatBoxResponse }

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit {

  public appUsers: AppUsers;
  public chatBoxData: ChatBoxData[] = [];
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
  }

  async ngOnInit() {
    var script = document.createElement("script");
    script.type = "text/javascript";
    script.src = "../assets/js/script.js";
    this.elementRef.nativeElement.appendChild(script);

    this.userId = sessionStorage.getItem(SystemConstants.USERID_KEY);
    this.loadFriendData();

    StaticWSMediator.register(this.syncMesgChat.bind(this), SYS_TOKEN_DEF.SYNC_MESG_CHAT);
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
    if (this.chatBoxData.findIndex(_ => _.TheOtherId == theOtherId) == -1) {
      this.chatService.loadChatBox(this.userId, theOtherId).subscribe(
        (res: any) => {
          this.chatBoxData.push({ TheOtherId: theOtherId, Data: { chatBoxId: res.chatBoxId, chatContentJson: JSON.parse(res.chatContentJson) } });
          this.displayedContent = [];
          const data: any = this.chatBoxData.find(_ => _.TheOtherId == theOtherId).Data;;
          for (let item of data.chatContentJson) {
            this.displayedContent.push(item);
          }
          this.displayedChatBoxId = data.chatBoxId;
        }
      );
    } else {
      this.displayedContent = [];
      const data: any = this.chatBoxData.find(_ => _.TheOtherId == theOtherId).Data;;
      for (let item of data.chatContentJson) {
        this.displayedContent.push(item);
      }
      this.displayedChatBoxId = data.chatBoxId;
    }
  }

  updateChatBoxContent(data: UpdateChatBoxContentResponse) {
    console.log(data);
    let chatBoxForUpdate = this.chatBoxData.find(_ => _.Data.chatBoxId == data.ChatBoxId);
    for (let item of data.UpdatedContentJson) {
      chatBoxForUpdate.Data.chatContentJson.push(item);
    }
    if (data.ChatBoxId == this.displayedChatBoxId) {
      for (let item of data.UpdatedContentJson) {
        this.displayedContent.push(item);
      }
    }
  }

  updateDisplayedChatBox(chatBoxId: string) {
    this.displayedContent = [];
    const data: any = this.chatBoxData.find(_ => _.Data.chatBoxId == chatBoxId).Data;
    for (let item of data.chatContentJson) {
      this.displayedContent.push(item);
    }
    this.displayedChatBoxId = data.chatBoxId;
    //this.syncMesgChat();
  }

  submitMessage(data: string) {
    console.log(data);
    var OLEAD: number;
    console.log(this.chatBoxData);
    const request: UpdateChatBoxContentRequest = {
      ChatBoxId: this.displayedChatBoxId,
      UserId: this.userId,
      Message: data,
      OLEAD: OLEAD//temp code
    }
    this.chatService.updateChatBoxContent(request).subscribe(
      (res: any) => {
        console.log(res);
        this.updateChatBoxContent({
          ChatBoxId: res.chatBoxId,
          UpdatedContentJson: JSON.parse(res.updatedContentJson)
        });
      }
    );
  }

  OnFriendListItemClicked(theOtherId: string) {
    this.loadChatBoxById(theOtherId);
  }

  private getCurrentOLEAD() {
  }

  syncMesgChat() {
    console.log("sync message chat");
    this.chatService.syncChatBoxContent(this.userId, this.displayedChatBoxId).subscribe(
      (res: any) => {
        console.log(res);
        let id: string = res.chatBoxId;
        let json: any[] = JSON.parse(res.updatedContentJson);
        let chatBoxForUpdate = this.chatBoxData.find(_ => _.Data.chatBoxId == id);
        for (let item of json) {
          chatBoxForUpdate.Data.chatContentJson.push(item);
        }
        if (id == this.displayedChatBoxId) {
          for (let item of json) {
            this.displayedContent.push(item);
          }
        }
      }
    );
  }
}
