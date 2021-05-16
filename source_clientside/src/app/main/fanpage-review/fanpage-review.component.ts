import { Component, OnInit, ElementRef, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { DOCUMENT } from '@angular/common';
import { LoginService } from '../../_core/services/login.service';
import { PagesService } from '../../_core/services/page.service';
import {Pages} from '../../_core/models/pages.model'
import { MatDialog } from '@angular/material/dialog';
import {TripUrl} from 'src/app/_helpers/get-trip-url'
import {PageUrl} from 'src/app/_helpers/get-page-url'
@Component({
    selector: 'app-fanpage-review',
    templateUrl: './fanpage-review.component.html',
    styleUrls: ['./fanpage-review.component.css']
})
export class FanpageReviewComponent implements OnInit {
    public pages: Pages;
    constructor(private router: Router, private elementRef: ElementRef,@Inject(DOCUMENT) private doc ,private service: LoginService,
    private PService:PagesService,public dialog: MatDialog, public tripurl:TripUrl, public pageurl:PageUrl) {}

    ngOnInit() {
      var script = document.createElement("script");
      script.type = "text/javascript";
      script.src = "../assets/js/script.js";
      this.elementRef.nativeElement.appendChild(script);
      this.router.routeReuseStrategy.shouldReuseRoute = () =>{
        return false;
      }
    }
    async loadmore()
    {
    }
}
