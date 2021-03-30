import { Component, OnInit } from '@angular/core';
import { LoginService } from '../../_core/services/login.service';
import { Router } from '@angular/router';
import { AppUsers } from 'src/app/login/shared/login.model';
import { UserProfile } from 'src/app/_core/data-repository/profile';
import { ApiUrlConstants } from 'src/app/_core/common/api-url.constants';
import { TimelineUrl } from 'src/app/_helpers/get-timeline-url';
@Component({
  selector: 'app-list-navigation',
  templateUrl: './list-navigation.component.html',
  styleUrls: ['./list-navigation.component.css']
})
export class ListNavigationComponent implements OnInit {
  public appUsers: AppUsers;
  constructor(private router: Router,private service: LoginService,public timelineurl:TimelineUrl) { }

  ngOnInit(): void {
    this.appUsers = new AppUsers();
    this.appUsers.Id = UserProfile.Id
    this.appUsers.FirstName = this.service.getFirstNameStorage()
    this.appUsers.LastName = UserProfile.LastName
    this.appUsers.Avatar = ApiUrlConstants.API_URL+"/"+UserProfile.Avatar
  }
}
