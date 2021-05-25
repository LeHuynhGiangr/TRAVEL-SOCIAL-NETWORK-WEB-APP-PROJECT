import { Component, OnInit, ElementRef, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { DOCUMENT } from '@angular/common';
import { Trips } from '../../_core/models/trip.model';
import { TripStatic } from '../../_core/data-repository/trip';
import {TripUrl} from 'src/app/_helpers/get-trip-url'
import { PagesService } from 'src/app/_core/services/page.service';
import { PageUrl } from 'src/app/_helpers/get-page-url';
@Component({
    selector: 'app-trip-detail',
    templateUrl: './trip-detail.component.html',
    styleUrls: ['./trip-detail.component.css']
})
export class TripDetailComponent implements OnInit {
    public trips :Trips;
    namePage
    phonePage
    constructor(private router: Router, private elementRef: ElementRef,@Inject(DOCUMENT) private doc, public tripurl:TripUrl,
    private PService:PagesService,public pageurl:PageUrl ) {}

    async ngOnInit() {
      var script = document.createElement("script");
      script.type = "text/javascript";
      script.src = "../assets/js/script.js";
      this.elementRef.nativeElement.appendChild(script);

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
      this.trips.Service = TripStatic.Service
      this.trips.PageId = TripStatic.PageId
      const page = await this.PService.getPageById(this.trips.PageId)
      this.namePage = page["name"]
      this.phonePage = page["phoneNumber"]
    }
    getPath(){
      return this.router.url;
    }
}
