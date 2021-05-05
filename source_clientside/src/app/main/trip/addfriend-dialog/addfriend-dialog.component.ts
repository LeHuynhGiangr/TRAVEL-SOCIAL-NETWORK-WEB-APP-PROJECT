import { Component, OnInit, ElementRef, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { DOCUMENT } from '@angular/common';
import { AppUsers } from '../../../login/shared/login.model';
import { LoginService } from '../../../_core/services/login.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UriHandler } from 'src/app/_helpers/uri-handler';
import { TripService } from '../../../_core/services/trip.service';
@Component({
    selector: 'app-addfriend-dialog',
    templateUrl: './addfriend-dialog.component.html',
    styleUrls: ['./addfriend-dialog.component.css']
  })
  export class AddFriendDialogComponent implements OnInit {
    public appUsers: AppUsers;
    public users:any
    public userList = new Array<AppUsers>();
    public idTrip
    constructor(public dialogRef: MatDialogRef<AddFriendDialogComponent>,private router: Router, private elementRef: ElementRef, @Inject(DOCUMENT) private doc,
      private service: LoginService, private TService:TripService,public uriHandler:UriHandler) {
  
    }
    async ngOnInit() {
      this.getUsersList()
    }
    onNoClick(): void {
        this.dialogRef.close();
    }
    getUsersList = async () => {
      //get friends in trip
      const users = await this.TService.getFriendInTrip(this.idTrip) as any;
  
      if (users.length > 0) {
        for (let i = 0; i < users.length; i++) {
          let user = new AppUsers()
          user.Id = users[i].userId
          const name = await this.service.getUserById(user.Id);
          user.FirstName = name["firstName"]
          user.LastName = name["lastName"]
          user.NamePayment = users[i].name +" (Account: "+user.FirstName+" "+user.LastName+")"
          user.PhoneNumber = users[i].phoneNumber
          user.Address = users[i].address
          user.Email = users[i].email
          user.Descriptions = users[i].peopleNumber
          this.userList.push(user)
        }
      }
    }
}