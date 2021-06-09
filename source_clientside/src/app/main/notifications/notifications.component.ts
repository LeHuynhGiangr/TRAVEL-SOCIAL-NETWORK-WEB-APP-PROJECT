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
  public notisList = new Array<Notifications>();
  loop:number
  constructor(private router: Router, private elementRef: ElementRef,@Inject(DOCUMENT) private doc ,private service: LoginService,
  public dialog: MatDialog,public uriHandler:UriHandler,public timelineurl:TimelineUrl,private Nservice:NotificationPageService,
  private Pservice:PagesService) {
    
  }
  
  ngOnInit() {
    var script = document.createElement("script");
    script.type = "text/javascript";
    script.src = "../assets/js/script.js";
    this.elementRef.nativeElement.appendChild(script);

    this.loop = 0
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
        this.loop = this.loop+1
        if(this.loop % 3 == 0)
        {
          this.notisList= new Array<Notifications>();
          this.getAllNotification()
        }
      });
      this.router.routeReuseStrategy.shouldReuseRoute = () =>{
        return false;
      }  
  }
  async getAllNotification()
  {
    const notis = await this.Nservice.getAllNotifications(this.service.getUserIdStorage()) as Array<any>
    for (let i = 0; i < notis.length; i++) {
      let noti = new Notifications()
      noti.Id = notis[i].id
      noti.DateCreated = notis[i].dateCreated
      noti.Description = notis[i].description
      noti.PageId = notis[i].pageId
      const page = await this.Pservice.getPageById(noti.PageId)
      if(page["avatar"] == "" || page["avatar"] == undefined)
        noti.PageAvatar= "assets/images/undefined.png"
      else
        noti.PageAvatar = ApiUrlConstants.API_URL+"/"+page["avatar"]
      this.notisList.push(noti)
    }
  }
}
