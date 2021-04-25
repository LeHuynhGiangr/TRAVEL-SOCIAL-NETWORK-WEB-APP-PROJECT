import { Component, OnInit, ElementRef, Inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DOCUMENT } from '@angular/common';
import { AppUsers } from './../../login/shared/login.model';
import { LoginService } from '../../_core/services/login.service';
import { EditInterestService } from '../../_core/services/edit-hobby.service';
import { UserProfile } from '../../_core/data-repository/profile'
import { MessageService } from 'primeng/api';
import { PrimeNGConfig } from 'primeng/api';
@Component({
    selector: 'app-edit-hobby',
    templateUrl: './edit-hobby.component.html',
    styleUrls: ['./edit-hobby.component.css'],
    providers: [MessageService]
})
export class EditHobbyComponent implements OnInit {
  public message: string;
  public appUsers: AppUsers;
  public m_returnUrl: string;
  constructor(private elementRef: ElementRef,@Inject(DOCUMENT) private doc ,private service: LoginService,
  private m_route: ActivatedRoute, private m_router: Router,private ETService:EditInterestService,
  private messageService: MessageService, private primengConfig: PrimeNGConfig) {
    
  }
  
  async ngOnInit() {
    var script = document.createElement("script");
    script.type = "text/javascript";
    script.src = "../assets/js/script.js";
    this.elementRef.nativeElement.appendChild(script);
    this.m_router.routeReuseStrategy.shouldReuseRoute = () =>{
      return false;
    }
    this.primengConfig.ripple = true;
    this.appUsers = new AppUsers();
    this.appUsers.Language = UserProfile.Language
    this.appUsers.Hobby = UserProfile.Hobby
  }
  showSuccess() {
    this.messageService.add({severity:'success', summary: 'Update Successfully', detail: 'Interest Info'});
    setTimeout(() => {
      this.refresh();
    }, 1500)
  }
  showError() {
    this.messageService.add({severity:'error', summary: 'Error', detail: 'Basic Info'});
    setTimeout(() => {
      this.refresh();
    }, 1500)
  }
  async onSave() {
    try{
      const formData = new FormData();
      formData.append('id', this.service.getUserIdStorage());
      if (1) {
        formData.append('hobby', this.appUsers.Hobby);
        formData.append('language', this.appUsers.Language);
        this.ETService.uploadProfile(this.service.getUserIdStorage(),formData);

        UserProfile.Hobby = this.appUsers.Hobby
        UserProfile.Language = this.appUsers.Language
        this.showSuccess()
      }
      else
      {
        this.showError()
      }
    }
    catch(e)
    {
      this.showError()
    }
  }
  refresh(): void {
    this.m_returnUrl = this.m_route.snapshot.queryParams['returnUrl'] || '/main/about';
    this.m_router.navigateByUrl(this.m_returnUrl, {skipLocationChange:true});
    //window.location.reload();
  }
}
