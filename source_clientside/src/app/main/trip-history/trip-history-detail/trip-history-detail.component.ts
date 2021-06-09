import { Component, OnInit, ElementRef, Inject, ViewChild } from '@angular/core';
import { TripService } from '../../../_core/services/trip.service';
import { Router } from '@angular/router';
import { DatePipe, DOCUMENT } from '@angular/common';
import { Trips } from 'src/app/_core/models/trip.model';
import { MatDialogRef } from '@angular/material/dialog';
import { PagesService } from 'src/app/_core/services/page.service';
@Component({
  selector: 'app-trip-history-detail',
  templateUrl: './trip-history-detail.component.html',
  styleUrls: ['./trip-history-detail.component.css'],
  providers: [DatePipe]
})
export class DialogTripHistoryDetailComponent implements OnInit {
    idTrip
    trips:any
    trip:Trips;
    dateStart:string
    dateEnd:string
    pageName:string
    datePayment:string
    constructor(public dialogRef: MatDialogRef<DialogTripHistoryDetailComponent>,
        private router: Router, private elementRef: ElementRef,@Inject(DOCUMENT) private doc, private TService:TripService,
        public datepipe: DatePipe, private Pservice:PagesService) {}
    async ngOnInit(){
        var script = document.createElement("script");
        script.type = "text/javascript";
        script.src = "../assets/js/script.js";
        this.elementRef.nativeElement.appendChild(script);
        this.getTripDetail()
    }
    onNoClick(): void {
        this.dialogRef.close();
    }
    async getTripDetail()
    {
        this.trips = await this.TService.getTripDetail(this.idTrip)
        this.trip = new Trips();
        this.trip.Name = this.trips["name"]
        this.trip.Content = this.trips["content"]
        this.trip.Description = this.trips["description"]
        this.trip.Start = this.trips["start"]
        this.trip.Destination = this.trips["destination"]
        this.dateStart= this.datepipe.transform(this.trips["dateStart"], 'dd-MM-yyyy');
        this.dateEnd = this.datepipe.transform(this.trips["dateEnd"], 'dd-MM-yyyy');
        this.trip.InfoContact = this.trips["infoContact"]
        this.trip.Service = this.trips["service"]
        this.trip.Policy = this.trips["policy"]
        this.trip.Persons = this.trips["persons"]
        this.trip.PageId = this.trips["pageId"]
        const page = await this.Pservice.getPageById(this.trip.PageId)
        this.pageName = page["name"]
    }
}

