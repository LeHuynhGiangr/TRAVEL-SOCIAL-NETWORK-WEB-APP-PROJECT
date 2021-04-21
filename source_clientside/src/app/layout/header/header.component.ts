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
import {PaymentHistoryDialogComponent} from '../../main/trip-payment/payment-history-dialog/payment-history-dialog.component'
import {MenuItem} from 'primeng/api';
@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
    items: MenuItem[];
    visibleSidebar1;
    visibleSidebar2;
    public appUsers: AppUsers;
    public NameSearch :string
    public m_returnUrl: string;
    public res:boolean=false
    public users:any
    public userList = new Array<AppUsers>();
    constructor(private router: Router ,private elementRef: ElementRef,@Inject(DOCUMENT) private doc,private service: LoginService, public uriHandler:UriHandler, private m_route: ActivatedRoute, private m_router: Router,
      public Sservice:SearchService,public timelineurl:TimelineUrl, public dialog: MatDialog) {}

    async ngOnInit() {
      var script = document.createElement("script");
      script.type = "text/javascript";
      script.src = "../assets/js/script.js";
      this.elementRef.nativeElement.appendChild(script);
      
      //item responsive
      this.items = [
        {label: '', icon: 'pi pi-fw pi-home',routerLink: ['/main/home']},
        {label: '', icon: 'pi pi-fw pi-compass',routerLink: ['/main/trip']},
        {label: '', icon: 'pi pi-fw pi-video',routerLink: ['/main/videos']},
        {label: '', icon: 'pi pi-fw pi-comments',routerLink: ['/main/messages']},
        {label: '', icon: 'pi pi-fw pi-bell',routerLink: ['/main/notifications']},
      ];
      //var user = await this.service.getUser();
      this.appUsers = new AppUsers();
      this.appUsers.Avatar = ApiUrlConstants.API_URL + "/" + this.service.getAvatarStorage()
      this.appUsers.Id = this.service.getUserIdStorage()
      this.appUsers.FirstName = this.service.getFirstNameStorage()
      this.appUsers.LastName = this.service.getLastNameStorage()
    }
    onLogout() {
      this.service.logout();
      this.router.navigateByUrl('/login');
    }
    openNav(){
      this.res=true
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
    openDialog(): void {
      const dialogRef = this.dialog.open(PaymentHistoryDialogComponent, {
        width: '500px',
        height: '400px',
      });
      dialogRef.afterClosed().subscribe(result => {
        this.router.routeReuseStrategy.shouldReuseRoute = () =>{
          return false;
        }
        console.log('The dialog was closed');
      });
    }
    returnId()
    {
      UserProfile.IdTemp = UserProfile.Id
    }
}

