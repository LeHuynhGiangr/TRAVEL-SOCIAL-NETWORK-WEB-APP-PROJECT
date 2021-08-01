import { Component, OnInit, ElementRef, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { DatePipe, DOCUMENT } from '@angular/common';
import { Trips } from '../../_core/models/trip.model';
import { TripStatic } from '../../_core/data-repository/trip';
import {TripUrl} from 'src/app/_helpers/get-trip-url'
import { PagesService } from 'src/app/_core/services/page.service';
import { PageUrl } from 'src/app/_helpers/get-page-url';
import { TripService } from 'src/app/_core/services/trip.service';
import { LoginService } from 'src/app/_core/services/login.service';
@Component({
    selector: 'app-trip-detail',
    templateUrl: './trip-detail.component.html',
    styleUrls: ['./trip-detail.component.css'],
    providers: [DatePipe]
})
export class TripDetailComponent implements OnInit {
    public trips :Trips;
    namePage
    phonePage
    addressPage
    createdDatePage
    persons:any
    tripIdTemp
    history:any
    checkbook:boolean
    datenow:Date
    datenow2:Date
    constructor(private router: Router, private elementRef: ElementRef,@Inject(DOCUMENT) private doc, public tripurl:TripUrl,
    private PService:PagesService,public pageurl:PageUrl, private TService:TripService, private service:LoginService,public datepipe: DatePipe ) {}

    async ngOnInit() {
      var script = document.createElement("script");
      script.type = "text/javascript";
      script.src = "../assets/js/script.js";
      this.elementRef.nativeElement.appendChild(script);

      this.checkbook = false
      this.history = await this.TService.getPaymentTrip(this.service.getUserIdStorage())
      for (let i = 0; i < this.history.length; i++) {
        if(this.history[i].tripId == TripStatic.Id)
          this.checkbook = true
      }
      this.trips = new Trips()
      this.trips.Id = TripStatic.Id
      this.trips.Name = TripStatic.Name
      this.trips.Description = TripStatic.Description
      this.trips.Cost = TripStatic.Cost
      this.trips.Start = TripStatic.Departure
      this.trips.Destination = TripStatic.Destination
      this.trips.Policy = TripStatic.Policy
      this.trips.InfoContact = TripStatic.InfoContact
      this.trips.Persons = TripStatic.Persons
      this.trips.DateStart = TripStatic.DateStart
      this.trips.DateEnd = TripStatic.DateEnd
      var Time1 = new Date(this.trips.DateEnd).getTime()
      var Time2 = new Date(this.trips.DateStart).getTime()
      this.trips.DuringDate = (Time1 - Time2)/86400000
      this.datenow = new Date()
      this.datenow2 = new Date(this.trips.DateStart)
      if(this.datenow.getTime() > this.datenow2.getTime())
        this.trips.SetDate = true
      else
        this.trips.SetDate = false
      this.trips.Service = TripStatic.Service
      this.trips.Image = TripStatic.Image
      this.trips.PageId = TripStatic.PageId
      const page = await this.PService.getPageById(this.trips.PageId)
      this.namePage = page["name"]
      this.phonePage = page["phoneNumber"]
      this.addressPage = page["address"]
      this.createdDatePage = this.datepipe.transform(page["dateCreated"], 'yyyy-MM-dd');
      this.persons = await this.TService.getFriendInTrip(this.trips.Id)
      this.trips.PersonsInTrip = this.persons.length
      this.trips.PersonsLimit = Number(this.trips.Persons)
    }
}
