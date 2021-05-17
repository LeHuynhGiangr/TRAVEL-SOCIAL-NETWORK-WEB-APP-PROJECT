import { Component, OnInit, ElementRef, Inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DOCUMENT } from '@angular/common';
import { AppUsers } from 'src/app/login/shared/login.model';
import { TimelineUrl } from 'src/app/_helpers/get-timeline-url';
import { LoginService } from 'src/app/_core/services/login.service';
import { MatDialog } from '@angular/material/dialog';
import { UserProfile } from 'src/app/_core/data-repository/profile';
import { ApiUrlConstants } from 'src/app/_core/common/api-url.constants';
import { DialogUploadBackgroundComponent } from '../timeline/dialog-uploadbackground/dialog-uploadbackground.component';
import { DialogUploadAvatarComponent } from '../timeline/dialog-uploadavatar/dialog-uploadavatar.component';
import { TimeLineService } from 'src/app/_core/services/timeline.service';
@Component({
    selector: 'app-background-area',
    templateUrl: './background-area.component.html',
    styleUrls: ['./background-area.component.css'],
    
})
export class BackgroundAreaComponent implements OnInit {

    public appUsers: AppUsers;
    public m_returnUrl: string;
    compareId: boolean;
    constructor(private m_route: ActivatedRoute, private m_router: Router, private elementRef: ElementRef,@Inject(DOCUMENT) private doc 
    ,private service: LoginService, public dialog: MatDialog,
    public timelineurl:TimelineUrl, private timeLineService: TimeLineService) {
      
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
        if(this.service.getUserIdStorage()==UserProfile.IdTemp)
        {
            this.compareId = true
            this.appUsers.Id = this.service.getUserIdStorage()
            this.appUsers.FirstName = this.service.getFirstNameStorage()
            this.appUsers.LastName=this.service.getLastNameStorage();
            this.appUsers.Avatar = ApiUrlConstants.API_URL+"/"+ this.service.getAvatarStorage()
            this.appUsers.Background = ApiUrlConstants.API_URL+"/"+ this.service.getBackgroundStorage()
        }

        if(this.service.getUserIdStorage()!=UserProfile.IdTemp)
        {
            this.compareId = false
            const user =await this.service.getUserById(UserProfile.IdTemp)
            this.appUsers.Id = UserProfile.IdTemp
            this.appUsers.FirstName = user["firstName"]
            this.appUsers.LastName = user["lastName"]
            this.appUsers.Avatar = ApiUrlConstants.API_URL+"/"+user["avatar"]
            this.appUsers.Background = ApiUrlConstants.API_URL+"/"+user["background"]
        }

    }
      openDialog(): void {
        const dialogRef = this.dialog.open(DialogUploadAvatarComponent, {
          width: '500px',
          height: '400px',
          data: { Id: this.appUsers.Id }
        });
    
        dialogRef.afterClosed().subscribe(async result => {
          console.log('The dialog was closed');
          const avt = await this.service.getUserById(this.service.getUserIdStorage())
          this.timeLineService.setAvatarStorage(avt["avatar"])
          this.appUsers.Avatar = ApiUrlConstants.API_URL + "/" + this.service.getAvatarStorage()
        });
      }
      openDialogBackground(): void {
        const dialogRef = this.dialog.open(DialogUploadBackgroundComponent, {
          width: '500px',
          height: '400px',
          data: { Id: this.appUsers.Id }
        });
    
        dialogRef.afterClosed().subscribe(async result => {
          console.log('The dialog was closed');
          const bgr = await this.service.getUserById(this.service.getUserIdStorage())
          this.timeLineService.setBackgroundStorage(bgr["background"])
          this.appUsers.Background = ApiUrlConstants.API_URL + "/" + this.service.getBackgroundStorage()
    
        });
      }
}