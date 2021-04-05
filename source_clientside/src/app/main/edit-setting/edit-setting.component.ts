import { Component, OnInit, ElementRef, Inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DOCUMENT } from '@angular/common';
import { AppUsers } from './../../login/shared/login.model';
import { LoginService } from '../../_core/services/login.service';
import { MatDialog } from '@angular/material/dialog';
import { EditSettingService } from '../../_core/services/edit-setting.service';
import { UserProfile } from '../../_core/data-repository/profile'
@Component({
    selector: 'app-edit-setting',
    templateUrl: './edit-setting.component.html',
    styleUrls: ['./edit-setting.component.css'],
    
})
export class EditSettingComponent implements OnInit {

  public appUsers: AppUsers;
  public m_returnUrl: string;
  constructor(private elementRef: ElementRef,@Inject(DOCUMENT) private doc ,private service: LoginService,public dialog: MatDialog,
   private m_route: ActivatedRoute, private m_router: Router, private ESService: EditSettingService) {
    
  }
  
  async ngOnInit() {
    var script = document.createElement("script");
    script.type = "text/javascript";
    script.src = "../assets/js/script.js";
    this.elementRef.nativeElement.appendChild(script);

    this.appUsers = new AppUsers();
    this.appUsers.FirstName = this.service.getFirstNameStorage()
    this.appUsers.LastName = this.service.getLastNameStorage()
    this.appUsers.Email = UserProfile.Email
    this.appUsers.Gender = UserProfile.Gender
    this.appUsers.Works = UserProfile.Works
    this.appUsers.Location = UserProfile.Location
    this.appUsers.PhoneNumber = UserProfile.PhoneNumber
    this.appUsers.Address = UserProfile.Address
    this.appUsers.Descriptions = UserProfile.Description
    this.appUsers.BirthDay = UserProfile.BirthDay
    this.appUsers.FollowMe = UserProfile.FollowMe
    this.appUsers.RequestFriend = UserProfile.RequestFriend
    this.appUsers.ViewListFriend = UserProfile.ViewListFriend
    this.appUsers.ViewTimeLine = UserProfile.ViewTimeLine
  }
  async onSave() {
    try{
      const formData = new FormData();
      formData.append('id', this.service.getUserIdStorage());
      if (1) {
        formData.append('firstName', this.appUsers.FirstName);
        formData.append('lastName', this.appUsers.LastName);
        formData.append('description', this.appUsers.Descriptions);
        formData.append('email', this.appUsers.Email);
        formData.append('address', this.appUsers.Address);
        formData.append('gender', this.appUsers.Gender);
        formData.append('phoneNumber', this.appUsers.PhoneNumber);
        formData.append('works', this.appUsers.Works);
        formData.append('birthDay', this.appUsers.BirthDay.toString());
        formData.append('followMe', this.appUsers.FollowMe.toString());
        formData.append('requestFriend', this.appUsers.RequestFriend.toString());
        formData.append('viewTimeLine', this.appUsers.ViewTimeLine.toString());
        formData.append('viewListFriend', this.appUsers.ViewListFriend.toString());
        formData.append('gender', this.appUsers.Gender);
        formData.append('phoneNumber', this.appUsers.PhoneNumber);
        formData.append('works', this.appUsers.Works);
        this.ESService.uploadProfile(this.appUsers.Id,formData);
        alert("Upload succesfully !")

        //Refresh user after edit interest
        //var user = await this.service.getUser();
        UserProfile.ViewListFriend = this.appUsers.ViewListFriend
        UserProfile.ViewTimeLine = this.appUsers.ViewTimeLine
        UserProfile.FollowMe = this.appUsers.FollowMe
        UserProfile.RequestFriend = this.appUsers.RequestFriend
        this.refresh();
      }
      else
      {
        alert("Upload failure !")
      }
    }
    catch(e)
    {
      alert("Upload failure !")
    }
  }
  refresh(): void {
    this.m_returnUrl = this.m_route.snapshot.queryParams['returnUrl'] || '/main/about';
    this.m_router.navigateByUrl(this.m_returnUrl, {skipLocationChange:true});
  }
  onChange1 = (event: any) => {
    this.appUsers.ViewTimeLine = event.target.value;
  }
  onChange2 = (event: any) => {
    this.appUsers.FollowMe = event.target.value;
  }
  onChange3 = (event: any) => {
    this.appUsers.ViewListFriend = event.target.value;
  }
  onChange4 = (event: any) => {
    this.appUsers.RequestFriend = event.target.value;
  }
}
