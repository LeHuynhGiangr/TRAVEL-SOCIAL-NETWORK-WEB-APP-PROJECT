import { Component, OnInit, ElementRef, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { AppUsers } from './../../login/shared/login.model';
import { LoginService } from '../../_core/services/login.service';
import { EditBasicService } from '../../_core/services/edit-basic.service';
import { ActivatedRoute, Router } from '@angular/router';
import { UserProfile } from '../../_core/data-repository/profile'
@Component({
    selector: 'app-edit-basic',
    templateUrl: './edit-basic.component.html',
    styleUrls: ['./edit-basic.component.css'],
    
})
export class EditBasicComponent implements OnInit {

  public appUsers: AppUsers;
  public m_returnUrl: string;
  constructor(private elementRef: ElementRef,@Inject(DOCUMENT) private doc ,private service: LoginService, 
    private EBService: EditBasicService, private m_route: ActivatedRoute, private m_router: Router) {
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
    this.appUsers.BirthDay= UserProfile.BirthDay
    this.appUsers.FollowMe = UserProfile.FollowMe
    this.appUsers.RequestFriend = UserProfile.RequestFriend
    this.appUsers.ViewListFriend = UserProfile.ViewListFriend
    this.appUsers.ViewTimeLine = UserProfile.ViewTimeLine
    this.m_router.routeReuseStrategy.shouldReuseRoute = () =>{
      return false;
    }
  }
  onSubmit() {
    console.log('title is:');
  }
  onChangeGender = (event: any) => {
    this.appUsers.Gender = event.target.value;
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
        this.EBService.uploadProfile(this.service.getUserIdStorage(),formData);
        alert("Upload succesfully !")

        //Refresh user after edit profile
        //var user = await this.service.getUser();
        UserProfile.Email = this.appUsers.Email
        UserProfile.Address = this.appUsers.Address
        UserProfile.BirthDay = this.appUsers.BirthDay
        UserProfile.Gender = this.appUsers.Gender
        UserProfile.PhoneNumber = this.appUsers.PhoneNumber
        UserProfile.Description = this.appUsers.Descriptions
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
    //window.location.reload();
  }
}
