import { Component, OnInit, ElementRef, Inject } from '@angular/core';
import { Router } from '@angular/router';
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
@Component({
    selector: 'app-inbox',
    templateUrl: './inbox.component.html',
    styleUrls: ['./inbox.component.css']
})
export class InboxComponent implements OnInit {

    public appUsers: AppUsers;
    constructor(private router: Router, private elementRef: ElementRef,@Inject(DOCUMENT) private doc,private service: LoginService,public dialog: MatDialog ,
    public uriHandler:UriHandler,public timelineurl:TimelineUrl) {}

    async ngOnInit() {
      var script = document.createElement("script");
      script.type = "text/javascript";
      script.src = "../assets/js/script.js";
      this.elementRef.nativeElement.appendChild(script);

      this.appUsers = new AppUsers();
      this.appUsers.FirstName = this.service.getFirstNameStorage()
      this.appUsers.LastName = UserProfile.LastName
      this.appUsers.Avatar =  ApiUrlConstants.API_URL+"/"+UserProfile.Avatar
      this.appUsers.Background =  ApiUrlConstants.API_URL+"/"+UserProfile.Background
    }
    getPath(){
      return this.router.url;
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
            console.log(user["firstName"] + " " + user["lastName"]);
            this.appUsers.Id = user["id"].toString();
            this.appUsers.Avatar = user["avatar"]
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
            console.log(user["firstName"] + " " + user["lastName"]);
            this.appUsers.Id = user["id"].toString();
            this.appUsers.Background = user["background"]
          }
        });
  
      });
    }
    returnId()
    {
      UserProfile.IdTemp = UserProfile.Id
    }
}
