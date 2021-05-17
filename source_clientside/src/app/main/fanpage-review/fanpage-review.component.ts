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
@Component({
    selector: 'app-fanpage-review',
    templateUrl: './fanpage-review.component.html',
    styleUrls: ['./fanpage-review.component.css']
})
export class FanpageReviewComponent implements OnInit {
    public pages: Pages;
    public ratings:any
    countRating:number=0
    userid;
    rating:number=0
    reviews: string;
    star1:number=0
    star2:number=0
    star3:number=0
    star4:number=0
    star5:number=0
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
      this.ratings = await this.RService.getAllRatings()
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
      if(this.countRating > 1)
        this.reviews = this.countRating.toString() + " reviews"
      else
        this.reviews = this.countRating.toString() + " review"
      this.ngAfterViewInit()
    }
    ngAfterViewInit() {
      (document.querySelector('.star1') as HTMLElement).style.width = (this.star1 / this.countRating) *100 + '%';
      (document.querySelector('.star2') as HTMLElement).style.width = (this.star2 / this.countRating) *100 + '%';
      (document.querySelector('.star3') as HTMLElement).style.width = (this.star3 / this.countRating) *100 + '%';
      (document.querySelector('.star4') as HTMLElement).style.width = (this.star4 / this.countRating) *100 + '%';
      (document.querySelector('.star5') as HTMLElement).style.width = (this.star5 / this.countRating) *100 + '%';
    }
    async loadmore()
    {
    }
}
