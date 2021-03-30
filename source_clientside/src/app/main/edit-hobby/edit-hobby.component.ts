import { Component, OnInit, ElementRef, Inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DOCUMENT } from '@angular/common';
import { AppUsers } from './../../login/shared/login.model';
import { LoginService } from '../../_core/services/login.service';
import { EditInterestService } from '../../_core/services/edit-hobby.service';
import { UserProfile } from '../../_core/data-repository/profile'
@Component({
    selector: 'app-edit-hobby',
    templateUrl: './edit-hobby.component.html',
    styleUrls: ['./edit-hobby.component.css'],
    
})
export class EditHobbyComponent implements OnInit {

  public appUsers: AppUsers;
  public m_returnUrl: string;
  constructor(private elementRef: ElementRef,@Inject(DOCUMENT) private doc ,private service: LoginService,
  private m_route: ActivatedRoute, private m_router: Router,private ETService:EditInterestService) {
    
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
    this.appUsers.Language = UserProfile.Language
    this.appUsers.Hobby = UserProfile.Hobby
  }

  async onSave() {
    try{
      const formData = new FormData();
      formData.append('id', this.service.getUserIdStorage());
      if (1) {
        formData.append('hobby', this.appUsers.Hobby);
        formData.append('language', this.appUsers.Language);
        this.ETService.uploadProfile(this.service.getUserIdStorage(),formData);
        alert("Upload succesfully !")
        
        //Refresh user after edit interest
        //var user = await this.service.getUser();
        UserProfile.Hobby = this.appUsers.Hobby
        UserProfile.Language = this.appUsers.Language
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
