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

@Component({
  selector: 'app-right-sidebar-list-friend',
  templateUrl: './right-sidebar-list-friend.component.html',
  styleUrls: ['./right-sidebar-list-friend.component.css']
})
export class RightSidebarListFriendComponent implements OnInit, AfterViewChecked {
  @ViewChild('scrollMe') private myScrollContainer: ElementRef;
  display: boolean = false;
  NameUser:string
  AvatarUser:string
  AvatarNow:string
  ClientId:string
  IdUser:string
  Content:string
  Attachment:File
  url;
  public messages:any
  public messagesList = new Array<Messages>();
  public m_friends:{
    Id:string,
    Name:string,
    avarThumb:string
  }[]
  constructor(public m_chattingService:ChattingService, public m_uriHandler:UriHandler, private service:LoginService,
    private MService:MessagesService2,private timelineurl:TimelineUrl) {
    this.loadFriendData();
  }

  ngOnInit(): void {
    this.AvatarNow = ApiUrlConstants.API_URL+"/"+ this.service.getAvatarStorage()
    this.IdUser = this.service.getUserIdStorage()
    this.loadFriendData();
    this.scrollToBottom()
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
        this.messagesList = new Array<Messages>();
        this.loadMessages(this.ClientId)
      });  
  }
  ngAfterViewChecked() {        
    this.scrollToBottom();        
  } 
  scrollToBottom(): void {
    try {
        this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
    } catch(err) { }                 
  }
  loadFriendData(){
    this.m_chattingService.getFriendDataById().subscribe(jsonData => {
      this.m_friends=jsonData.friendJsonString});
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
    this.NameUser = user["firstName"]+" "+user["lastName"]
    this.AvatarUser = ApiUrlConstants.API_URL+"/" + user["avatar"]
    this.loadMessages(id)
  }
  async loadMessages(id)
  {
    this.messages = await this.MService.getMessagesUser(id)
    for (let i = 0;i<this.messages.length;i++) 
    {
      let message = new Messages()
      message.Id = this.messages[i].id
      message.Content = this.messages[i].content
      message.FromId = this.messages[i].fromId
      if(this.messages[i].attachment == undefined)
        message.Attachment = null
      else
        message.Attachment = ApiUrlConstants.API_URL+"/" +this.messages[i].attachment
      this.messagesList.push(message)
    }
  }
  async sendMessage()
  {
    try{
      const formData = new FormData();
      formData.append('toId', this.ClientId);
      formData.append('content',this.Content)
      formData.append('subject',this.NameUser+" sent you a message...")
      formData.append('attachment',this.Attachment)
      if(this.Content=="")
      {
        this.timelineurl.showError("Please enter full information !")
      }         
      else
      {
        await this.MService.sendMessages(formData)
        this.Content = ""
        this.url = null
        this.Attachment = null
      }
    }
    catch(e)
    {
      this.timelineurl.showError(e);
    }
  }
}
