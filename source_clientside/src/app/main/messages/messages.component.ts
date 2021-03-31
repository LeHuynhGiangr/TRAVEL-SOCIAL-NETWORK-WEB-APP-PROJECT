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
    selector: 'app-messages',
    templateUrl: './messages.component.html',
    styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit {

  public appUsers: AppUsers;
  constructor(private router: Router, private elementRef: ElementRef,@Inject(DOCUMENT) private doc ,private service: LoginService,public dialog: MatDialog,
  public uriHandler:UriHandler,public timelineurl:TimelineUrl) {
    
  }
  
  async ngOnInit() {
    var script = document.createElement("script");
    script.type = "text/javascript";
    script.src = "../assets/js/script.js";
    this.elementRef.nativeElement.appendChild(script);
  }
  returnId()
    {
      UserProfile.IdTemp = UserProfile.Id
    }
}
