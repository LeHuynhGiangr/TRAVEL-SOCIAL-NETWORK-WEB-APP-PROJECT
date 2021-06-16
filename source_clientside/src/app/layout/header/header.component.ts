import { Component, OnInit, ElementRef, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { AppUsers } from './../../login/shared/login.model';
import { LoginService } from '../../_core/services/login.service';
import { UriHandler } from 'src/app/_helpers/uri-handler';
import { UserProfile } from '../../_core/data-repository/profile'
import { SearchService } from '../../_core/services/friends-search.service';
import { TimelineUrl } from 'src/app/_helpers/get-timeline-url';
import { ApiUrlConstants } from '../../../../src/app/_core/common/api-url.constants';
import { MatDialog } from '@angular/material/dialog';
import {MenuItem, MessageService, PrimeNGConfig} from 'primeng/api';
import { Notifications } from 'src/app/_core/models/notifications.model';
import { NotificationPageService } from 'src/app/_core/services/notificationpage.service';
import { PagesService } from 'src/app/_core/services/page.service';
import { environment } from 'src/environments/environment';
import * as signalR from '@aspnet/signalr';
import { PageUrl } from 'src/app/_helpers/get-page-url';
@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
    items: MenuItem[];
    activeItem: MenuItem;
    visibleSidebar1;
    visibleSidebar2;
    public appUsers: AppUsers;
    public NameSearch :string
    public m_returnUrl: string;
    public res:boolean=false
    public users:any
    public userList = new Array<AppUsers>();
    public notisList = new Array<Notifications>();
    pageid
    loop:number
    noticount
    constructor(private router: Router ,private elementRef: ElementRef,@Inject(DOCUMENT) private doc,private service: LoginService, public uriHandler:UriHandler, private m_route: ActivatedRoute, private m_router: Router,
      public Sservice:SearchService,public timelineurl:TimelineUrl, public dialog: MatDialog,private Nservice:NotificationPageService,
      private Pservice:PagesService,private messageService: MessageService, private primengConfig: PrimeNGConfig, public pageurl:PageUrl) {}

    async ngOnInit() {
      var script = document.createElement("script");
      script.type = "text/javascript";
      script.src = "../assets/js/script.js";
      this.elementRef.nativeElement.appendChild(script);
      this.router.routeReuseStrategy.shouldReuseRoute = () =>{
        return false;
      }
      this.getAllNotification()
      this.loop = 0
      this.noticount = 0
      this.primengConfig.ripple = true;
      //item responsive
      this.items = [
        {label: '', icon: 'pi pi-fw pi-home',routerLink: ['/main/home']},
        {label: '', icon: 'pi pi-fw pi-compass',routerLink: ['/main/trip']},
        {label: '', icon: 'pi pi-fw pi-video',routerLink: ['/main/videos']},
        {label: '', icon: 'pi pi-fw pi-comments',routerLink: ['/main/messages']},
        {label: '', icon: 'pi pi-fw pi-bell',routerLink: ['/main/notifications']},
      ];
      if(this.router.url =='/main/home')
        this.activeItem = this.items[0]
      if(this.router.url =='/main/trip')
        this.activeItem = this.items[1]
      if(this.router.url =='/main/videos')
        this.activeItem = this.items[2]
      if(this.router.url =='/main/messages')
        this.activeItem = this.items[3]
      if(this.router.url =='/main/notifications')
        this.activeItem = this.items[4]
      //var user = await this.service.getUser();
      this.appUsers = new AppUsers();
      this.appUsers.Avatar = ApiUrlConstants.API_URL + "/" + this.service.getAvatarStorage()
      this.appUsers.Id = this.service.getUserIdStorage()
      this.appUsers.FirstName = this.service.getFirstNameStorage()
      this.appUsers.LastName = this.service.getLastNameStorage()
      this.connection()
    }
    connection()
    {
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
        if(this.loop % 2 == 0)
        {
          this.notisList= new Array<Notifications>();
          this.getAllNotification()
          this.noticount = this.noticount + 1
        }
      }); 
    }
    resetcount()
    {
      this.noticount = 0
    }
    onLogout() {
      this.service.logout();
      this.router.navigateByUrl('/login');
    }
    async search(){
      UserProfile.Name = this.NameSearch
      this.users = await this.Sservice.getAllUsersByName(UserProfile.Name);
        for (let i = 0; i < this.users.length; i++) {
            let user = new AppUsers();
            user.Id = this.users[i].id.toString();
            user.FirstName = this.users[i].firstName;
            user.LastName = this.users[i].lastName;
            user.Descriptions = this.users[i].description
            user.Avatar = ApiUrlConstants.API_URL+"/"+this.users[i].avatar
            user.UserName = this.users[i].userName
            if(this.users[i].userName==UserProfile.UserName)
            {
                i=i+1;
            }
            else
            {
                this.userList.push(user);
            }
        }
      //this.refresh()
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
    returnId()
    {
      UserProfile.IdTemp = UserProfile.Id
    }
}

