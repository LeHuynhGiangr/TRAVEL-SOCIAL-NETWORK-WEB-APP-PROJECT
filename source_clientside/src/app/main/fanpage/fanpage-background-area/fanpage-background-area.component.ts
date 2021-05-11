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
@Component({
    selector: 'app-fanpage-background-area',
    templateUrl: './fanpage-background-area.component.html',
    styleUrls: ['./fanpage-background-area.component.css'],
    
})
export class FanpageBackgroundAreaComponent implements OnInit {
    public pages: Pages;
    userid;
    constructor(private m_router: Router, private elementRef: ElementRef,@Inject(DOCUMENT) private doc 
    , public dialog: MatDialog,private PService:PagesService, public pageurl:PageUrl, private service:LoginService) {
      
    }
    
    async ngOnInit() {
        var script = document.createElement("script");
        script.type = "text/javascript";
        script.src = "../assets/js/script.js";
        this.elementRef.nativeElement.appendChild(script);
        this.m_router.routeReuseStrategy.shouldReuseRoute = () =>{
          return false;
        }
        this.getPage()
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
            this.pageurl.savePageInfoStorage(infoPage["name"],infoPage["avatar"],infoPage["background"],infoPage["userId"])
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
            this.pageurl.savePageInfoStorage(infoPage["name"],infoPage["avatar"],infoPage["background"],infoPage["userId"])
            this.pages.Background = ApiUrlConstants.API_URL + "/" + this.pageurl.getPageBackgroundStorage()
        });
      }
}