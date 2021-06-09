import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TripHistory } from 'src/app/_core/models/trip-history.model';
import { TripService } from 'src/app/_core/services/trip.service';
@Component({
    selector: 'app-dialog-passengers',
    templateUrl: './dialog-passengers.component.html',
    styleUrls: ['./dialog-passengers.component.css']
  })
  export class DialogPassengersComponent implements OnInit {
    idTrip
    passengers:any
    passenger:TripHistory
    public passengerList = new Array<TripHistory>();
    constructor(public dialogRef: MatDialogRef<DialogPassengersComponent>, @Inject(MAT_DIALOG_DATA) public data: any
    ,private TService:TripService){}
    async ngOnInit() {
        this.getListPassengers()
    }
    async getListPassengers()
    {
        this.passengers = await this.TService.getFriendInTrip(this.idTrip)
        for (let i = 0; i < this.passengers.length; i++) {
            this.passenger = new TripHistory()
            this.passenger.Name = this.passengers[i].name
            this.passenger.PhoneNumber = this.passengers[i].phoneNumber
            this.passenger.Email = this.passengers[i].email
            this.passenger.Address = this.passengers[i].address
            this.passenger.Requirements = this.passengers[i].requirements
            this.passenger.PeopleNumber = this.passengers[i].peopleNumber
            this.passenger.DateCreated = this.passengers[i].dateCreated
            this.passenger.CostPayment = this.passengers[i].costPayment
            this.passengerList.push(this.passenger)
        }
    }
  }