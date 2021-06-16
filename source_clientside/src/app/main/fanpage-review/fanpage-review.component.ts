import { Component, OnInit, ElementRef, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { DOCUMENT } from '@angular/common';
import { LoginService } from '../../_core/services/login.service';
import { PagesService } from '../../_core/services/page.service';
import {Pages} from '../../_core/models/pages.model'
import { MatDialog } from '@angular/material/dialog';
import {TripUrl} from 'src/app/_helpers/get-trip-url'
import {PageUrl} from 'src/app/_helpers/get-page-url'
import { RatingService } from 'src/app/_core/services/rating.service';
import { ApiUrlConstants } from 'src/app/_core/common/api-url.constants';
import { Ratings } from 'src/app/_core/models/rating.model';
import { DialogReviewComponent } from '../fanpage/dialog-review/dialog-review.component';
import * as signalR from '@aspnet/signalr';
import { environment } from 'src/environments/environment';
@Component({
    selector: 'app-fanpage-review',
    templateUrl: './fanpage-review.component.html',
    styleUrls: ['./fanpage-review.component.css']
})
export class FanpageReviewComponent implements OnInit {
    public pages: Pages;
    public userRatings:any
    public userRatingsList = new Array<Ratings>();
    userRatingsListSort
    public ratings:any
    countRating:number=0
    rating:number=0
    reviews: string;
    star1:number=0
    star2:number=0
    star3:number=0
    star4:number=0
    star5:number=0
    imgsample:string
    iduser
    listcount
    constructor(private router: Router, private elementRef: ElementRef,@Inject(DOCUMENT) private doc ,private service: LoginService,
    private PService:PagesService,public dialog: MatDialog, public tripurl:TripUrl, public pageurl:PageUrl,private RService:RatingService) {}
    async ngOnInit() {
      var script = document.createElement("script");
      script.type = "text/javascript";
      script.src = "../assets/js/script.js";
      this.elementRef.nativeElement.appendChild(script);
      this.router.routeReuseStrategy.shouldReuseRoute = () =>{
        return false;
      }
      this.iduser = this.service.getUserIdStorage()
      this.getListReview()
      this.ratings = await this.RService.getAllRatings(this.pageurl.getPageIdStorage())
      for (let i = 0; i < this.ratings.length; i++) {
          if(parseFloat(this.ratings[i].rating) == 1)
            this.star1 += 1
          if(parseFloat(this.ratings[i].rating) == 2)
            this.star2 += 1
          if(parseFloat(this.ratings[i].rating) == 3)
            this.star3 += 1
          if(parseFloat(this.ratings[i].rating) == 4)
            this.star4 += 1
          if(parseFloat(this.ratings[i].rating) == 5)
            this.star5 += 1
          this.rating += parseFloat(this.ratings[i].rating)
          this.countRating += 1
      }
      this.rating = this.rating / this.countRating
      this.rating = parseFloat(this.rating.toFixed(2))
      if(this.countRating > 1)
        this.reviews = this.countRating.toString() + " reviews"
      else
        this.reviews = this.countRating.toString() + " review"
      this.ngAfterViewInit()
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
        this.userRatingsList = new Array<Ratings>();
        this.getListReview()
        this.ngAfterViewInit()
        this.router.routeReuseStrategy.shouldReuseRoute = () =>{
          return false;
        }  
      });
    }
    ngAfterViewInit() {
      (document.querySelector('.star1') as HTMLElement).style.width = (this.star1 / this.countRating) *100 + '%';
      (document.querySelector('.star2') as HTMLElement).style.width = (this.star2 / this.countRating) *100 + '%';
      (document.querySelector('.star3') as HTMLElement).style.width = (this.star3 / this.countRating) *100 + '%';
      (document.querySelector('.star4') as HTMLElement).style.width = (this.star4 / this.countRating) *100 + '%';
      (document.querySelector('.star5') as HTMLElement).style.width = (this.star5 / this.countRating) *100 + '%';
    }
    async getListReview()
    {
      this.userRatings = await this.RService.getAllRatings(this.pageurl.getPageIdStorage())
      this.listcount = this.userRatings.length
      for (let i = this.userRatings.length-1; i >=0; i--) {
        if((this.userRatings[i].pageId.toString() == this.pageurl.getPageIdStorage()) && this.userRatings[i].active == true)
        {
          let userRating = new Ratings();
          userRating.Id = this.userRatings[i].id.toString()
          userRating.Content = this.userRatings[i].content
          userRating.Active = this.userRatings[i].active
          userRating.Rating = this.userRatings[i].rating
          userRating.DateCreated = this.userRatings[i].dateCreated
          userRating.UserId = this.userRatings[i].userId.toString()
          const user = await this.service.getUserById(this.userRatings[i].userId.toString())
          userRating.NameUser = user["firstName"] + " " + user["lastName"]
          userRating.AvatarUser = ApiUrlConstants.API_URL  + "/" + user["avatar"]
          userRating.PageId = this.userRatings[i].pageId.toString()
          this.userRatingsList.push(userRating)
        }
      }
      this.userRatingsListSort = this.userRatingsList.sort((a, b) => new Date(b.DateCreated).valueOf() - new Date(a.DateCreated).valueOf())
    }
    openDialogReview(): void {
      const dialogRef = this.dialog.open(DialogReviewComponent, {
        width: '500px',
        height: '320px',
      });
      dialogRef.afterClosed().subscribe(async result => {
        this.router.routeReuseStrategy.shouldReuseRoute = () =>{
          return false;
        }
        this.userRatingsList = new Array<Ratings>();
        this.getListReview()
        this.ngAfterViewInit()
      });
    }
    async blockRating(id)
    {
      const block = await this.RService.blockRating(id)
      this.router.routeReuseStrategy.shouldReuseRoute = () =>{
        return false;
      }
      this.userRatingsList = new Array<Ratings>();
      this.getListReview()
      this.ngAfterViewInit()
    }
    async loadmore()
    {
    }
}
