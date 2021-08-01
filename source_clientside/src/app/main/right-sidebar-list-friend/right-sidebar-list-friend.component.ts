import { AfterViewChecked } from '@angular/core';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Messages } from '../../_core/models/messages.model';
import { ApiUrlConstants } from 'src/app/_core/common/api-url.constants';
import { ChattingService } from 'src/app/_core/services/chatting.service';
import { LoginService } from 'src/app/_core/services/login.service';
import { MessagesService2 } from 'src/app/_core/services/messages.service';
import { UriHandler } from 'src/app/_helpers/uri-handler';
import { TimelineUrl } from 'src/app/_helpers/get-timeline-url';
import * as signalR from '@aspnet/signalr';
import { environment } from 'src/environments/environment';
import { ConfirmationService, ConfirmEventType, MenuItem, MessageService, PrimeNGConfig } from 'primeng/api';

@Component({
  selector: 'app-right-sidebar-list-friend',
  templateUrl: './right-sidebar-list-friend.component.html',
  styleUrls: ['./right-sidebar-list-friend.component.css']
})
export class RightSidebarListFriendComponent implements OnInit, AfterViewChecked {
  @ViewChild('scrollMe') private myScrollContainer: ElementRef;
  display: boolean = false;
  NameUser: string
  AvatarUser: string
  AvatarNow: string
  ClientId: string
  IdUser: string
  Content: string
  Attachment: File
  url;
  home
  public messages: any
  public messagesList = new Array<Messages>();
  public m_friends: {
    Id: string,
    Name: string,
    avarThumb: string
  }[]
  items: MenuItem[];
  constructor(public m_chattingService: ChattingService, public m_uriHandler: UriHandler, private service: LoginService,
    private MService: MessagesService2, public timelineurl: TimelineUrl, private messageService: MessageService,
    private primengConfig: PrimeNGConfig, private confirmationService: ConfirmationService) {
    this.loadFriendData();
  }

  ngOnInit(): void {
    this.primengConfig.ripple = true;
    this.Content= ""
    this.AvatarNow = ApiUrlConstants.API_URL + "/" + this.service.getAvatarStorage()
    this.IdUser = this.service.getUserIdStorage()
    this.loadFriendData();
    this.scrollToBottom()
    this.items = [
      {
        label: 'Block', icon: 'pi pi-lock', command: () => {

        }
      },
      {
        label: 'Delete', icon: 'pi pi-trash', command: () => {
          this.deleteAllMessages(this.ClientId)
        }
      },
    ];
    const connection = new signalR.HubConnectionBuilder()
      .configureLogging(signalR.LogLevel.Information)
      .withUrl(environment.baseUrl)
      .build();
    connection.start().then(function () {
      console.log('SignalR Connected!');
    }).catch(function (err) {
      return console.error(err.toString());
    });

    connection.on("BroadcastMessage", () => {
      // this.messagesList = new Array<Messages>();

      this.loadMessages(this.ClientId)
    });
  }
  ngAfterViewChecked() {
    this.scrollToBottom();
  }
  scrollToBottom(): void {
    try {
      this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
    } catch (err) { }
  }
  loadFriendData() {
    this.m_chattingService.getFriendDataById().subscribe(jsonData => {
      this.m_friends = jsonData.friendJsonString
    });
  }
  onSelectFile(event) {
    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]); // read file as data url
      reader.onload = (event) => { // called once readAsDataURL is completed
        this.url = event.target.result;
      }
      // Saved Image into varible
      this.Attachment = event.target.files[0];
    }
  }
  async showDialog(id) {
    this.messagesList = new Array<Messages>();
    this.display = true;
    const user = await this.service.getUserById(id);
    this.ClientId = id
    this.NameUser = user["firstName"] + " " + user["lastName"]
    this.AvatarUser = ApiUrlConstants.API_URL + "/" + user["avatar"]
    this.loadMessages(id)
  }
  async loadMessages(id) {
    this.messages = await this.MService.getMessagesUser(id)

    const messages = new Array<Messages>();

    for (let i = 0; i < this.messages.length; i++) {
      let message = new Messages()
      message.Id = this.messages[i].id
      message.Content = this.messages[i].content
      message.FromId = this.messages[i].fromId
      message.DateCreated = this.messages[i].dateCreated
      if (this.messages[i].attachment == undefined)
        message.Attachment = null
      else
        message.Attachment = ApiUrlConstants.API_URL + "/" + this.messages[i].attachment
      messages.push(message)
    }

    this.messagesList = messages;
  }
  async sendMessage() {
    try {
      const formData = new FormData();
      formData.append('toId', this.ClientId);
      formData.append('content', this.Content)
      formData.append('subject', this.NameUser + " sent you a message...")
      formData.append('attachment', this.Attachment)
      let checkchar = this.Content.replace(/\s/g, '')
      if ((checkchar==""&&this.Attachment==null) || (checkchar == "\n"&&this.Attachment==null)) {
        this.timelineurl.showError("Please enter full information !")
      }
      else {
        await this.MService.sendMessages(formData)
      }
      this.Content = ""
      this.url = null
      this.Attachment = null
    }
    catch (e) {
      this.timelineurl.showError(e);
    }
  }
  async deleteAllMessages(id) {
    this.confirmationService.confirm({
      message: 'Do you want to delete all messages ?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: async () => {
        await this.MService.deleteAllMessages(id)
        this.messageService.add({ severity: 'success', summary: 'Done', detail: 'Delete messages successfully' });
      },
      reject: (type) => {
        switch (type) {
          case ConfirmEventType.REJECT:
            this.messageService.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected' });
            break;
          case ConfirmEventType.CANCEL:
            this.messageService.add({ severity: 'warn', summary: 'Cancelled', detail: 'You have cancelled' });
            break;
        }
      }
    });
  }
}
