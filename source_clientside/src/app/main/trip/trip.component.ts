import { Component, OnInit, ElementRef, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { DOCUMENT } from '@angular/common';
import { LoginService } from '../../_core/services/login.service';
import { UserProfile } from '../../_core/data-repository/profile'
import { UriHandler } from 'src/app/_helpers/uri-handler';
import { MatDialog } from '@angular/material/dialog';
import { TripDialogComponent } from './trip-dialog/trip-dialog.component';
import { AddFriendDialogComponent } from './addfriend-dialog/addfriend-dialog.component';
import { Trips } from '../../_core/models/trip.model';
import { TripService } from '../../_core/services/trip.service';
import { ApiUrlConstants } from '../../../../src/app/_core/common/api-url.constants';
import { PagesService } from '../../_core/services/page.service';
import {PageUrl} from 'src/app/_helpers/get-page-url'
import {TripUrl} from 'src/app/_helpers/get-trip-url'
@Component({
    selector: 'app-trip',
    templateUrl: './trip.component.html',
    styleUrls: ['./trip.component.css']
  })
  export class TripComponent implements OnInit {
    public trips:any
    public tripList = new Array<Trips>();
    play:boolean
    interval;
    time: number = 0;
    check:boolean=true
    lengthcount
    count
    listcount
    constructor(private router: Router, private elementRef: ElementRef, @Inject(DOCUMENT) private doc,
      private service: LoginService,public uriHandler:UriHandler, public dialog: MatDialog,private TService:TripService,
      private PService:PagesService,public pageurl:PageUrl, public tripurl:TripUrl) {
        
    }
    async ngOnInit() {
        var script = document.createElement("script");
        script.type = "text/javascript";
        script.src = "../assets/js/script.js";
        this.elementRef.nativeElement.appendChild(script);

        this.getTripList()
        this.startTimer()
        UserProfile.count = 1
        this.router.routeReuseStrategy.shouldReuseRoute = () =>{
           return false;
         }
    }
    startTimer() {
      this.play = true;
      this.interval = setInterval(() => {
        this.time++;
        if(this.time>=50)
        {
          this.play = false
          clearInterval(this.interval);
        }
      },50)
    }
    getTripList = async () => {
      this.count=4
      this.trips = await this.TService.getAllTrips()
      this.listcount = this.trips.length
      this.lengthcount="2:"+this.count/2
      for (let i = 0; i < this.count; i++) {
          let trip = new Trips();
          trip.Id = this.trips[i].id.toString()
          trip.Name = this.trips[i].name
          trip.Description = this.trips[i].description
          trip.Image = ApiUrlConstants.API_URL+"/"+this.trips[i].image
          trip.authorId = this.trips[i].authorId
          trip.CreatedDate = this.trips[i].dateCreated
          trip.PageId = this.trips[i].pageId
          const page = await this.PService.getPageById(trip.PageId)
          trip.authorAvatar = ApiUrlConstants.API_URL+"/"+page["avatar"]
          trip.authorName = page["name"]
          trip.Cost = this.trips[i].cost
          trip.Content = this.trips[i].content
          this.tripList.push(trip)
      }
    }
    async getTripListmore(){
      this.time=0
      this.startTimer()
      this.trips = await this.TService.getAllTrips()
      this.count = this.count + 2
      this.lengthcount = "2:"+(this.count/2-1)
      for (let i = this.count-2; i < this.count; i++) {
          let trip = new Trips();
          trip.Id = this.trips[i].id.toString()
          trip.Name = this.trips[i].name
          trip.Description = this.trips[i].description
          trip.Image = ApiUrlConstants.API_URL+"/"+this.trips[i].image
          trip.authorId = this.trips[i].authorId
          trip.CreatedDate = this.trips[i].dateCreated
          trip.PageId = this.trips[i].pageId
          const page = await this.PService.getPageById(trip.PageId)
          trip.authorAvatar = ApiUrlConstants.API_URL+"/"+page["avatar"]
          trip.authorName = page["name"]
          trip.Cost = this.trips[i].cost
          trip.Content = this.trips[i].content
          this.tripList.push(trip)
      }
    }
    AddFriendDialog(id): void {
        const dialogRef = this.dialog.open(AddFriendDialogComponent, {
          width: '500px',
          height: '400px',
        });
        dialogRef.componentInstance.idTrip = id;
        dialogRef.afterClosed().subscribe(result => {
          console.log('The dialog was closed');
          console.log(result);
        });
      }
}