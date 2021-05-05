import { Component, OnInit, ElementRef, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { DOCUMENT } from '@angular/common';
import { AppUsers } from './../../login/shared/login.model';
import { LoginService } from '../../_core/services/login.service';
import { MatDialog } from '@angular/material/dialog';
import { UserProfile } from '../../_core/data-repository/profile'
import { UriHandler } from 'src/app/_helpers/uri-handler';
import { TimelineUrl } from 'src/app/_helpers/get-timeline-url';
import { ApiUrlConstants } from '../../../../src/app/_core/common/api-url.constants';
@Component({
    selector: 'app-notifications',
    templateUrl: './notifications.component.html',
    styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent implements OnInit {

  public appUsers: AppUsers;
  constructor(private router: Router, private elementRef: ElementRef,@Inject(DOCUMENT) private doc ,private service: LoginService,
  public dialog: MatDialog,public uriHandler:UriHandler,public timelineurl:TimelineUrl) {
    
  }
  
  async ngOnInit() {
    var script = document.createElement("script");
    script.type = "text/javascript";
    script.src = "../assets/js/script.js";
    this.elementRef.nativeElement.appendChild(script);

    this.appUsers = new AppUsers();
    this.appUsers.Id = this.service.getUserIdStorage()
    this.appUsers.FirstName = this.service.getFirstNameStorage()
    this.appUsers.LastName = this.service.getLastNameStorage()
    this.appUsers.Avatar = ApiUrlConstants.API_URL+"/"+this.service.getAvatarStorage()
    this.appUsers.Background = ApiUrlConstants.API_URL+"/"+this.service.getBackgroundStorage()
  }
  returnId()
  {
      UserProfile.IdTemp = this.service.getUserIdStorage()
  }
}
