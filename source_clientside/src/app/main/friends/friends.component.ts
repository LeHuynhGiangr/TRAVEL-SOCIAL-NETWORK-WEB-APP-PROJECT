import { Component, OnInit, ElementRef, Inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DOCUMENT } from '@angular/common';
import { AppUsers } from './../../login/shared/login.model';
import { LoginService } from '../../_core/services/login.service';
import { MatDialog } from '@angular/material/dialog';
import { DialogUploadAvatarComponent } from '../timeline/dialog-uploadavatar/dialog-uploadavatar.component';
import { DialogUploadBackgroundComponent } from '../timeline/dialog-uploadbackground/dialog-uploadbackground.component';
import { UserProfile } from '../../_core/data-repository/profile'
import { UriHandler } from 'src/app/_helpers/uri-handler';
import { FriendService } from '../../_core/services/friends.service';
import { TimelineUrl } from 'src/app/_helpers/get-timeline-url';
import { ApiUrlConstants } from '../../../../src/app/_core/common/api-url.constants';
@Component({
    selector: 'app-friends',
    templateUrl: './friends.component.html',
    styleUrls: ['./friends.component.css'],
    
})
export class FriendsComponent implements OnInit {

  public appUsers: AppUsers;
  public m_returnUrl: string;
  public users:any
  public userList = new Array<AppUsers>();
  compareId: boolean;
  constructor(private m_route: ActivatedRoute, private m_router: Router, private elementRef: ElementRef,@Inject(DOCUMENT) private doc ,private service: LoginService,public dialog: MatDialog
  ,public uriHandler:UriHandler,private FService:FriendService, public timelineurl:TimelineUrl) {
    
  }
  
  async ngOnInit() {
    var script = document.createElement("script");
    script.type = "text/javascript";
    script.src = "../assets/js/script.js";
    this.elementRef.nativeElement.appendChild(script);
    this.m_router.routeReuseStrategy.shouldReuseRoute = () =>{
      return false;
    }
    this.appUsers = new AppUsers();
    console.log(UserProfile.IdTemp)
    console.log(UserProfile.Id)
    if(UserProfile.Id==UserProfile.IdTemp)
    {
      this.compareId =true
      this.appUsers.FirstName = this.service.getFirstNameStorage()
      this.appUsers.LastName = UserProfile.LastName
      this.appUsers.Avatar = ApiUrlConstants.API_URL+"/"+UserProfile.Avatar
      this.appUsers.Background = ApiUrlConstants.API_URL+"/"+UserProfile.Background
      this.getUserList()
    }
    if(UserProfile.Id!=UserProfile.IdTemp)
    {
      this.compareId =false
      const user =await this.service.getUserById(UserProfile.IdTemp)
      console.log(user)
      this.appUsers.Id = UserProfile.IdTemp
      this.appUsers.FirstName = user["firstName"]
      this.appUsers.LastName = user["lastName"]
      this.appUsers.Avatar = ApiUrlConstants.API_URL+"/"+user["avatar"]
      this.appUsers.Background = ApiUrlConstants.API_URL+"/"+user["background"]
      this.appUsers.ViewListFriend = user["viewListFriend"]
      if(this.appUsers.ViewListFriend==true)
        this.getUserList()
    }
    }

    onLogout() {
      this.service.logout();
      this.m_router.navigateByUrl('/login');
    }
    onFileChanged(event) {
      this.appUsers.Avatar = event.target.files[0]
    }

    openDialog(): void {
      const dialogRef = this.dialog.open(DialogUploadAvatarComponent, {
        width: '500px',
        height: '400px',
        data: { Id: this.appUsers.Id }
      });

      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed');
        console.log(result);
        this.service.getUser().then(user => {
          if (user) {
            this.appUsers.Avatar = ApiUrlConstants.API_URL+"/"+user["avatar"]
            UserProfile.Avatar = user["avatar"]
          }
        });
      });
    }
    openDialogBackground(): void {
      const dialogRef = this.dialog.open(DialogUploadBackgroundComponent, {
        width: '500px',
        height: '400px',
        data: { Id: this.appUsers.Id }
      });
  
      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed');
        console.log(result);
        this.service.getUser().then(user => {
          if (user) {
            this.appUsers.Background = ApiUrlConstants.API_URL+"/"+user["background"]
            UserProfile.Background = user["background"]
          }
        });
  
      });
    }
    getUserList = async () => {
      console.log(UserProfile.Id)
      this.users = await this.FService.getAllFriends();
      for (let i = 0; i < this.users.length; i++) {
          let user = new AppUsers();
          user.Id = this.users[i].id.toString();
          user.FirstName = this.users[i].firstName;
          user.LastName = this.users[i].lastName;
          user.Descriptions = this.users[i].description
          user.Avatar = ApiUrlConstants.API_URL+"/"+this.users[i].avatar
          if(this.users[i].id==UserProfile.Id)
          {
              console.log("trung roi")
          }
          else
          {
              this.userList.push(user);
          }
      }
    }
}
