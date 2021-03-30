import { Component, OnInit, ElementRef, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { DOCUMENT } from '@angular/common';
import { AppUsers } from './../../login/shared/login.model';
import { LoginService } from '../../_core/services/login.service';
import { UserProfile } from '../../_core/data-repository/profile'
import { FriendService } from '../../_core/services/friends.service';
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
  constructor(private m_router: Router, private elementRef: ElementRef,@Inject(DOCUMENT) private doc ,private service: LoginService,
  private FService:FriendService) {
    
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
      if(this.service.getUserIdStorage() == UserProfile.IdTemp)
      {
        this.getUserList()
      }
      if(this.service.getUserIdStorage() != UserProfile.IdTemp)
      {
        const user =await this.service.getUserById(UserProfile.IdTemp)
        this.appUsers.ViewListFriend = user["viewListFriend"]
        if(this.appUsers.ViewListFriend == true)
          this.getUserList()
      }
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
          user.Avatar = ApiUrlConstants.API_URL + "/" + this.users[i].avatar
          if(this.users[i].id == UserProfile.Id)
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
