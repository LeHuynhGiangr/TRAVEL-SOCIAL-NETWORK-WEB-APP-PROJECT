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
import { TimelineUrl } from 'src/app/_helpers/get-timeline-url';
import { ApiUrlConstants } from '../../../../src/app/_core/common/api-url.constants';
import { EditBasicService } from 'src/app/_core/services/edit-basic.service';
@Component({
    selector: 'app-about',
    templateUrl: './about.component.html',
    styleUrls: ['./about.component.css'],
    
})
export class AboutComponent implements OnInit {

  public appUsers: AppUsers;
  public m_returnUrl: string;
  compareId: boolean;
  constructor( private elementRef: ElementRef,@Inject(DOCUMENT) private doc ,private service: LoginService,
  private m_route: ActivatedRoute, private m_router: Router,public dialog: MatDialog, public uriHandler:UriHandler,
  public timelineurl:TimelineUrl) {
    
  }
  
  async ngOnInit() {
    var script = document.createElement("script");
    script.type = "text/javascript";
    script.src = "../assets/js/script.js";
    this.elementRef.nativeElement.appendChild(script);

    this.appUsers = new AppUsers();
    if(UserProfile.Id==UserProfile.IdTemp)
    {
      this.compareId =true
      this.appUsers.FirstName = this.service.getFirstNameStorage()
      this.appUsers.LastName=UserProfile.LastName
      this.appUsers.Avatar = ApiUrlConstants.API_URL+"/"+UserProfile.Avatar
      this.appUsers.Descriptions = UserProfile.Description
      this.appUsers.Address = UserProfile.Address
      this.appUsers.PhoneNumber = UserProfile.PhoneNumber
      this.appUsers.Email = UserProfile.Email
      this.appUsers.BirthDay= UserProfile.BirthDay
      this.appUsers.AcademicLevel = UserProfile.AcademicLevel
      this.appUsers.AddressAcademic = UserProfile.AddressAcademic
      this.appUsers.DescriptionAcademic = UserProfile.DescriptionAcademic
      this.appUsers.StudyingAt = UserProfile.StudyingAt
      this.appUsers.FromDate = UserProfile.FromDate
      this.appUsers.ToDate = UserProfile.ToDate
      this.appUsers.Hobby = UserProfile.Hobby
      this.appUsers.Language = UserProfile.Language
      this.appUsers.Background = ApiUrlConstants.API_URL+"/"+UserProfile.Background
      this.appUsers.Gender = UserProfile.Gender
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
      this.appUsers.Descriptions = user["description"]
      this.appUsers.Address = user["address"]
      this.appUsers.PhoneNumber = user["phoneNumber"]
      this.appUsers.Email = user["email"]
      this.appUsers.BirthDay= user["birthDay"]
      this.appUsers.AcademicLevel = user["academicLevel"]
      this.appUsers.AddressAcademic = user["addressAcademic"]
      this.appUsers.DescriptionAcademic = user["descriptionAcademic"]
      this.appUsers.StudyingAt = user["studyingAt"]
      this.appUsers.FromDate = user["fromDate"]
      this.appUsers.ToDate = user["toDate"]
      this.appUsers.Hobby = user["hobby"]
      this.appUsers.Language = user["language"]
      this.appUsers.Gender = user["gender"]
    }
    this.m_router.routeReuseStrategy.shouldReuseRoute = () =>{
      return false;
    }
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
}
