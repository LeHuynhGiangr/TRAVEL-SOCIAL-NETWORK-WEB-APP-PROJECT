import { Component, OnInit, ElementRef, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { DOCUMENT } from '@angular/common';
import { AppUsers } from './../../login/shared/login.model';
import { Notifications } from '../../_core/models/notifications.model';
import { LoginService } from '../../_core/services/login.service';
import { NotificationPageService } from '../../_core/services/notificationpage.service';
import { MatDialog } from '@angular/material/dialog';
import { UserProfile } from '../../_core/data-repository/profile'
import { UriHandler } from 'src/app/_helpers/uri-handler';
import { TimelineUrl } from 'src/app/_helpers/get-timeline-url';
import { ApiUrlConstants } from '../../../../src/app/_core/common/api-url.constants';
import { PagesService } from 'src/app/_core/services/page.service';
import * as signalR from '@aspnet/signalr';
import { environment } from 'src/environments/environment';
@Component({
    selector: 'app-notifications',
    templateUrl: './notifications.component.html',
    styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent implements OnInit {

  public appUsers: AppUsers;
  public notis : any
  public notisnew : any
  public notisList = new Array<Notifications>();
  public noti: Notifications
  constructor(private router: Router, private elementRef: ElementRef,@Inject(DOCUMENT) private doc ,private service: LoginService,
  public dialog: MatDialog,public uriHandler:UriHandler,public timelineurl:TimelineUrl,private Nservice:NotificationPageService,
  private Pservice:PagesService) {
    
  }
  
  async ngOnInit() {
    var script = document.createElement("script");
    script.type = "text/javascript";
    script.src = "../assets/js/script.js";
    this.elementRef.nativeElement.appendChild(script);

    this.appUsers = new AppUsers();
    this.appUsers.Id = this.service.getUserIdStorage()
    this.getAllNotification()
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
        this.notisList= new Array<Notifications>();
        this.getAllNotification()
      });  
      this.router.routeReuseStrategy.shouldReuseRoute = () =>{
        return false;
    }
  }
  async getAllNotification()
  {
    this.notis = await this.Nservice.getAllNotifications(this.service.getUserIdStorage())
    for (let i = 0; i < this.notis.length; i++) {
      this.noti = new Notifications()
      this.noti.Id = this.notis[i].id
      this.noti.DateCreated = this.notis[i].dateCreated
      this.noti.Description = this.notis[i].description
      this.noti.PageId = this.notis[i].pageId
      const page = await this.Pservice.getPageById(this.noti.PageId)
      if(page["avatar"] == "" || page["avatar"] == undefined)
        this.noti.PageAvatar= "assets/images/undefined.png"
      else
        this.noti.PageAvatar = ApiUrlConstants.API_URL+"/"+page["avatar"]
      this.notisList.push(this.noti)
    }
  }
  async getNewNotification()
  {
    this.notis = await this.Nservice.getNewNotifications(this.service.getUserIdStorage())
    for (let i = 0; i < this.notis.length; i++) {
      this.noti = new Notifications()
      this.noti.Id = this.notis[i].id
      this.noti.DateCreated = this.notis[i].dateCreated
      this.noti.Description = this.notis[i].description
      this.noti.PageId = this.notis[i].pageId
      const page = await this.Pservice.getPageById(this.noti.PageId)
      if(page["avatar"] == "" || page["avatar"] == undefined)
        this.noti.PageAvatar= "assets/images/undefined.png"
      else
        this.noti.PageAvatar = ApiUrlConstants.API_URL+"/"+page["avatar"]
      this.notisList.push(this.noti)
    }
  }
}
