import { Component, OnInit, ElementRef, Inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DOCUMENT } from '@angular/common';
import { AppUsers } from './../../login/shared/login.model';
import { LoginService } from '../../_core/services/login.service';
import { UserProfile } from '../../_core/data-repository/profile'
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
  private m_router: Router) {
    
  }
  
  async ngOnInit() {
    var script = document.createElement("script");
    script.type = "text/javascript";
    script.src = "../assets/js/script.js";
    this.elementRef.nativeElement.appendChild(script);

    this.appUsers = new AppUsers();
    if(this.service.getUserIdStorage()==UserProfile.IdTemp)
    {
      this.compareId =true
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
      this.appUsers.Gender = UserProfile.Gender
    }
    else
    {
      this.compareId = false
      const user = await this.service.getUserById(UserProfile.IdTemp)
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
}
