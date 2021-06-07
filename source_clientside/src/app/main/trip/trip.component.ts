import { Component, OnInit, ElementRef, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { DOCUMENT } from '@angular/common';
import { LoginService } from '../../_core/services/login.service';
import { UserProfile } from '../../_core/data-repository/profile'
import { UriHandler } from 'src/app/_helpers/uri-handler';
import { MatDialog } from '@angular/material/dialog';
import * as signalR from '@aspnet/signalr';  
import { environment } from 'src/environments/environment';  
import { AddFriendDialogComponent } from './addfriend-dialog/addfriend-dialog.component';
import { Trips } from '../../_core/models/trip.model';
import { TripService } from '../../_core/services/trip.service';
import { ApiUrlConstants } from '../../../../src/app/_core/common/api-url.constants';
import { PagesService } from '../../_core/services/page.service';
import {PageUrl} from 'src/app/_helpers/get-page-url'
import {TripUrl} from 'src/app/_helpers/get-trip-url'
import { FilterTrip } from 'src/app/_core/models/filtertrip.model';
@Component({
    selector: 'app-trip',
    templateUrl: './trip.component.html',
    styleUrls: ['./trip.component.css']
  })
  export class TripComponent implements OnInit {
    public trips:any
    public filters:any
    public tripList = new Array<Trips>();
    play:boolean
    interval;
    time: number = 0;
    check:boolean=true
    lengthcount
    count
    listcount
    name:string=null
    coststart:number=null
    costend:number=null
    persons:any
    personlength:number
    persontrip:number
    datenow:Date
    datenow2:Date
    setcount:number
    constructor(private router: Router, private elementRef: ElementRef, @Inject(DOCUMENT) private doc,
      private service: LoginService,public uriHandler:UriHandler, public dialog: MatDialog,private TService:TripService,
      private PService:PagesService,public pageurl:PageUrl, public tripurl:TripUrl) {
        
    }
    async ngOnInit() {
      var script = document.createElement("script");
      script.type = "text/javascript";
      script.src = "../assets/js/script.js";
      this.elementRef.nativeElement.appendChild(script);

      this.filters = new FilterTrip()
      this.filters.Name = ""
      this.filters.CostStart = 0
      this.filters.CostEnd = 99999999
      this.getTripList()
      this.startTimer()
      UserProfile.count = 1
      const connection = new signalR.HubConnectionBuilder()  
      .configureLogging(signalR.LogLevel.Information)  
      .withUrl(environment.baseUrl)  
      .build(); 
      connection.start().then(function () {  
        console.log('SignalR Connected!');  
      }).catch(function (err) {  
        return console.error(err.toString());  
      });  
    
      connection.on("BroadcastMessage", () => {  
        this.tripList = new Array<Trips>();
        this.getTripList()  
      });  
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
    async filter()
    {      
      if(this.name == null)
        this.filters.Name = ""
      else
        this.filters.Name = this.name
      if(this.coststart == null)
        this.filters.CostStart = 0
      else
        this.filters.CostStart = this.coststart
      if(this.costend == null)
        this.filters.CostEnd = 99999999
      else
        this.filters.CostEnd = this.costend
      this.tripList = new Array<Trips>();
      this.getTripList()
    }
    getTripList = async () => {
      this.count=4
      this.trips = await this.TService.filterTrip(this.filters)
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
          trip.DateStart = this.trips[i].dateStart
          this.datenow = new Date()
          this.datenow2 = new Date(trip.DateStart)
          if(this.datenow.getDate() > this.datenow2.getDate())
            trip.SetDate = true
          else
            trip.SetDate = false
          trip.Persons =this.trips[i].persons
          trip.PersonsLimit = Number(trip.Persons)
          trip.PageId = this.trips[i].pageId
          const page = await this.PService.getPageById(trip.PageId)
          trip.authorAvatar = ApiUrlConstants.API_URL+"/"+page["avatar"]
          trip.authorName = page["name"]
          trip.Cost = this.trips[i].cost
          trip.Content = this.trips[i].content
          this.persons = await this.TService.getFriendInTrip(trip.Id)
          trip.PersonsInTrip = this.persons.length
          this.tripList.push(trip)
      }
    }
    async getTripListmore(){
      this.time=0
      this.startTimer()
      this.trips = await this.TService.filterTrip(this.filters)
      if(this.count + 2 > this.trips.length)
        this.setcount = 1
      else
        this.setcount = 2
      console.log(this.setcount)
      this.count = this.count + this.setcount
      if(this.count % 2 == 0)
        this.lengthcount = "2:"+((this.count)/2-1)
      else
        this.lengthcount = "2:"+((this.count+1)/2-1)
      for (let i = this.count - this.setcount; i < this.count; i++) {
          let trip = new Trips();
          trip.Id = this.trips[i].id.toString()
          trip.Name = this.trips[i].name
          trip.Description = this.trips[i].description
          trip.Image = ApiUrlConstants.API_URL+"/"+this.trips[i].image
          trip.authorId = this.trips[i].authorId
          trip.CreatedDate = this.trips[i].dateCreated
          trip.DateStart = this.trips[i].dateStart
          this.datenow = new Date()
          this.datenow2 = new Date(trip.DateStart)
          if(this.datenow.getDate() > this.datenow2.getDate())
            trip.SetDate = true
          else
            trip.SetDate = false
          trip.Persons =this.trips[i].persons
          trip.PersonsLimit = Number(trip.Persons)
          trip.PageId = this.trips[i].pageId
          const page = await this.PService.getPageById(trip.PageId)
          trip.authorAvatar = ApiUrlConstants.API_URL+"/"+page["avatar"]
          trip.authorName = page["name"]
          trip.Cost = this.trips[i].cost
          trip.Content = this.trips[i].content
          this.persons = await this.TService.getFriendInTrip(trip.Id)
          trip.PersonsInTrip = this.persons.length
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