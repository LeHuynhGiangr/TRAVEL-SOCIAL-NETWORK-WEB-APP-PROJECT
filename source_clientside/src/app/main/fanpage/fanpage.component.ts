import { Component, OnInit, ElementRef, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { DOCUMENT } from '@angular/common';
import { LoginService } from '../../_core/services/login.service';
import { PagesService } from '../../_core/services/page.service';
import {Pages} from '../../_core/models/pages.model'
import { TripDialogComponent } from 'src/app/main/trip/trip-dialog/trip-dialog.component';
import { ApiUrlConstants } from '../../../../src/app/_core/common/api-url.constants';
import { MatDialog } from '@angular/material/dialog';
import { Trips } from '../../_core/models/trip.model';
import { TripService } from '../../_core/services/trip.service';
import {TripUrl} from 'src/app/_helpers/get-trip-url'
import {PageUrl} from 'src/app/_helpers/get-page-url'
import { AddFriendDialogComponent } from '../trip/addfriend-dialog/addfriend-dialog.component';
import * as signalR from '@aspnet/signalr';
import { environment } from 'src/environments/environment';
@Component({
    selector: 'app-fanpage',
    templateUrl: './fanpage.component.html',
    styleUrls: ['./fanpage.component.css']
})
export class FanpageComponent implements OnInit {
    public pages: Pages;
    public trips:any
    public tripList = new Array<Trips>();
    userid:string
    play:boolean
    interval;
    time: number = 0;
    check:boolean=true
    lengthcount
    count
    listcount
    constructor(private router: Router, private elementRef: ElementRef,@Inject(DOCUMENT) private doc ,private service: LoginService,
    private PService:PagesService,public dialog: MatDialog,private TService:TripService, public tripurl:TripUrl, public pageurl:PageUrl) {}

    ngOnInit() {
      var script = document.createElement("script");
      script.type = "text/javascript";
      script.src = "../assets/js/script.js";
      this.elementRef.nativeElement.appendChild(script);
      this.router.routeReuseStrategy.shouldReuseRoute = () =>{
        return false;
      }
      this.userid=this.service.getUserIdStorage()
      this.getPage()
      this.startTimer()
      this.getTripList()
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
    }
    async getPage(){
      this.pages = new Pages()
      this.pages.Id = this.pageurl.getPageIdStorage()
      this.pages.Avatar = ApiUrlConstants.API_URL+"/"+this.pageurl.getPageAvatarStorage()   
    }
    CreateTripDialog(): void {
      const dialogRef = this.dialog.open(TripDialogComponent, {
        width: '600px',
        height: '600px',
      });
  
      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed');
        console.log(result);
      });
    }
    onLogout() {
      this.service.logout();
      this.router.navigateByUrl('/login');
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
      this.trips = await this.TService.getAllTripsByPageId(this.pageurl.getPageIdStorage())
      this.listcount = this.trips.length
      this.lengthcount="2:"+this.count/2
      for (let i = 0; i < this.count; i++) {
          let trip = new Trips();
          trip.Id = this.trips[i].id.toString()
          trip.Name = this.trips[i].name
          trip.Description = this.trips[i].description
          trip.Content = this.trips[i].content
          trip.Image = ApiUrlConstants.API_URL+"/"+this.trips[i].image
          trip.authorId = this.trips[i].authorId
          trip.CreatedDate = this.trips[i].dateCreated
          trip.PageId = this.trips[i].pageId
          const page = await this.PService.getPageById(trip.PageId)
          trip.authorAvatar = ApiUrlConstants.API_URL+"/"+page["avatar"]
          trip.authorName = page["name"]
          trip.Cost = this.trips[i].cost
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
