import { Component, Output, EventEmitter, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Trips } from 'src/app/_core/models/trip.model';
import { TripService } from 'src/app/_core/services/trip.service';
import { PageUrl } from 'src/app/_helpers/get-page-url';
import {ThemePalette} from '@angular/material/core';
@Component({
    selector: 'app-dialog-modifytrip',
    templateUrl: './dialog-modifytrip.component.html',
    styleUrls: ['./dialog-modifytrip.component.css']
  })
export class DialogModifyTripComponent implements OnInit {
    @Output() submitClicked = new EventEmitter<any>();
    public trips : Trips
    color: ThemePalette = 'accent';
    checked = false;
    disabled = false;
    constructor(public dialogRef: MatDialogRef<DialogModifyTripComponent>, @Inject(MAT_DIALOG_DATA) public data: any,
    public pageurl:PageUrl,private TService:TripService){}
    async ngOnInit() {
        const trip = await this.TService.getTripDetail(this.data.idtrip)
        this.trips = new Trips()
        this.trips.Id = this.data.idtrip
        this.trips.Content = trip["content"]
        this.trips.Cost = trip["cost"]
        this.trips.DateEnd = trip["dateEnd"]
        this.trips.DateStart = trip["dateStart"]
        this.trips.Start = trip["start"]
        this.trips.Description = trip["description"]
        this.trips.Destination = trip["destination"]
        this.trips.InfoContact = trip["infoContact"]
        this.trips.Name = trip["name"]
        this.trips.Persons = trip["persons"]
        this.trips.Policy = trip["policy"]
        this.trips.Service = trip["service"]
        this.trips.Active = trip["active"]
        console.log(this.trips.Content)
    }
    onNoClick(): void {
        this.dialogRef.close();
    }
    async onSave()
    {
        this.trips.Cost = this.trips.Cost.toString()
        this.trips.Persons = this.trips.Persons.toString()
        const trip = await this.TService.modifyTrip(this.data.idtrip,this.trips)
        console.log(this.trips)
        alert("Update successfully !")
        this.dialogRef.close();
    }
}