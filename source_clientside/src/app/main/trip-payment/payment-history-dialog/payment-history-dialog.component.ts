import { Component, OnInit, ElementRef, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { DOCUMENT } from '@angular/common';
import { LoginService } from '../../../_core/services/login.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UriHandler } from 'src/app/_helpers/uri-handler';
import { TripService } from '../../../_core/services/trip.service';
import { AppUsers } from '../../../login/shared/login.model';
@Component({
    selector: 'app-payment-history-dialog',
    templateUrl: './payment-history-dialog.component.html',
    styleUrls: ['./payment-history-dialog.component.css']
  })
  export class PaymentHistoryDialogComponent implements OnInit {
    public appUsers: AppUsers;
    public users:any
    public userList = new Array<AppUsers>();
    constructor(public dialogRef: MatDialogRef<PaymentHistoryDialogComponent>,private router: Router, private elementRef: ElementRef, @Inject(DOCUMENT) private doc,
      private service: LoginService, private TService:TripService,public uriHandler:UriHandler) {
  
    }
    async ngOnInit() {
        this.getPaymentHistoryList()
    }
    onNoClick(): void {
        this.dialogRef.close();
    }
    getPaymentHistoryList = async () => {
        //get friends in trip
        const users = await this.TService.getPaymentTrip(this.service.getUserIdStorage()) as any;
        console.log(users)
        if (users.length > 0) {
          for (let i = 0; i < users.length; i++) {
            let user = new AppUsers()
            user.Id = users[i].userId
            const name = await this.service.getUserById(user.Id);
            user.Works = users[i].tripId
            user.Descriptions = users[i].costPayment
            user.BirthDay = users[i].dateCreated
            this.userList.push(user)
          }
        }
      }
}