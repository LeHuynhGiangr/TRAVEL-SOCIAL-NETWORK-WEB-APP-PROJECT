import { Component, OnInit, ElementRef, Inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DOCUMENT } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { ApiUrlConstants } from 'src/app/_core/common/api-url.constants';
import { DialogUploadPageAvatarComponent } from '../dialog-uploadpageavatar/dialog-uploadpageavatar.component';
import { PagesService } from 'src/app/_core/services/page.service';
import { PageUrl } from 'src/app/_helpers/get-page-url';
import { Pages } from 'src/app/_core/models/pages.model';
import { DialogUploadPageBackgroundComponent } from '../dialog-uploadpagebackground/dialog-uploadpagebackground.component';
import { LoginService } from 'src/app/_core/services/login.service';
import { RatingService } from 'src/app/_core/services/rating.service';
import * as signalR from '@aspnet/signalr';
import { environment } from 'src/environments/environment';
import { Follow } from 'src/app/_core/models/models.request/checkfollow';
@Component({
    selector: 'app-fanpage-background-area',
    templateUrl: './fanpage-background-area.component.html',
    styleUrls: ['./fanpage-background-area.component.css'],
    
})
export class FanpageBackgroundAreaComponent implements OnInit {
    public pages: Pages;
    public follows: Follow;
    public ratings:any
    countRating:number=0
    userid;
    rating:number=0
    reviews: string;
    check:boolean
    constructor(private m_router: Router, private elementRef: ElementRef,@Inject(DOCUMENT) private doc 
    , public dialog: MatDialog,private PService:PagesService, public pageurl:PageUrl, private service:LoginService, 
    private RService:RatingService) {
      
    }
    
    async ngOnInit() {
      var script = document.createElement("script");
      script.type = "text/javascript";
      script.src = "../assets/js/script.js";
      this.elementRef.nativeElement.appendChild(script);
      this.m_router.routeReuseStrategy.shouldReuseRoute = () =>{
        return false;
      }
      this.follows = new Follow()
      this.follows.pageId = this.pageurl.getPageIdStorage()
      this.getRatingStar()
      this.getPage()
      this.checkFollow()
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
        this.getRatingStar()  
      });
    }
    async getPage(){
        this.pages = new Pages()
        this.pages.Id = this.pageurl.getPageIdStorage()
        this.pages.Name =  this.pageurl.getPageNameStorage()
        this.pages.Avatar = ApiUrlConstants.API_URL+"/"+this.pageurl.getPageAvatarStorage()
        this.pages.Background = ApiUrlConstants.API_URL+"/"+this.pageurl.getPageBackgroundStorage()
        this.pages.UserId = this.pageurl.getPageUserIdStorage()
        this.userid = this.service.getUserIdStorage()
      }
    openDialogAvatar(): void {
        const dialogRef = this.dialog.open(DialogUploadPageAvatarComponent, {
          width: '500px',
          height: '400px',
        });
        dialogRef.afterClosed().subscribe(async result => {
          this.m_router.routeReuseStrategy.shouldReuseRoute = () =>{
            return false;
          }
          const infoPage = await this.PService.getPageById(this.pageurl.getPageIdStorage())
            this.pageurl.savePageInfoStorage(infoPage["name"],infoPage["avatar"],infoPage["background"],
            infoPage["address"],infoPage["phoneNumber"],infoPage["description"],infoPage["follow"],infoPage["userId"])
            this.pages.Avatar = ApiUrlConstants.API_URL + "/" + this.pageurl.getPageAvatarStorage()
        });
      }
    openDialogBackground(): void {
      const dialogRef = this.dialog.open(DialogUploadPageBackgroundComponent, {
        width: '500px',
        height: '400px',
      });
      dialogRef.afterClosed().subscribe(async result => {
        this.m_router.routeReuseStrategy.shouldReuseRoute = () =>{
          return false;
        }
        const infoPage = await this.PService.getPageById(this.pageurl.getPageIdStorage())
        this.pageurl.savePageInfoStorage(infoPage["name"],infoPage["avatar"],infoPage["background"],
        infoPage["address"],infoPage["phoneNumber"],infoPage["description"],infoPage["follow"],infoPage["userId"])
        this.pages.Background = ApiUrlConstants.API_URL + "/" + this.pageurl.getPageBackgroundStorage()
      });
    }
    async getRatingStar()
    {
      this.rating = 0
      this.countRating = 0
      this.ratings = await this.RService.getAllRatings(this.pageurl.getPageIdStorage())
      for (let i = 0; i < this.ratings.length; i++) {
          this.rating += parseFloat(this.ratings[i].rating)
          this.countRating += 1
      }
      if(this.countRating >0)
      {
        this.rating = this.rating / this.countRating
        this.rating = parseFloat(this.rating.toFixed(2));
      }
      else
        this.rating = 0
      if(this.countRating > 1)
        this.reviews = this.countRating.toString() + " reviews"
      else
        this.reviews = this.countRating.toString() + " review"
    }
    async follow()
    {
      const follow = await this.PService.followPage(this.follows)
      this.check = true
    }
    async unfollow()
    {
      const follow = await this.PService.unfollowPage(this.follows)
      this.check = false
    }
    async checkFollow()
    {
      const follow = await this.PService.checkfollowPage(this.follows)
      this.check = Boolean(follow)
    }
}