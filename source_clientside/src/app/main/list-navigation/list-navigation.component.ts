import { Component, ElementRef, Inject, OnInit } from '@angular/core';
import { LoginService } from '../../_core/services/login.service';
import { Router } from '@angular/router';
import { AppUsers } from 'src/app/login/shared/login.model';
import { ApiUrlConstants } from 'src/app/_core/common/api-url.constants';
import { TimelineUrl } from 'src/app/_helpers/get-timeline-url';
import { DOCUMENT } from '@angular/common';
@Component({
  selector: 'app-list-navigation',
  templateUrl: './list-navigation.component.html',
  styleUrls: ['./list-navigation.component.css']
})
export class ListNavigationComponent implements OnInit {
  public appUsers: AppUsers;
  constructor(private router: Router, private elementRef: ElementRef, @Inject(DOCUMENT) private doc,private service: LoginService,public timelineurl:TimelineUrl) { }

  ngOnInit(): void {
    var script = document.createElement("script");
    script.type = "text/javascript";
    script.src = "../assets/js/script.js";
    this.elementRef.nativeElement.appendChild(script);
    this.loaduser()
  }
  loaduser()
  {
    this.appUsers = new AppUsers();
    this.appUsers.Id = this.service.getUserIdStorage()
    this.appUsers.FirstName = this.service.getFirstNameStorage()
    this.appUsers.LastName = this.service.getLastNameStorage()
    this.appUsers.Avatar = ApiUrlConstants.API_URL+"/"+this.service.getAvatarStorage()
  }
}
