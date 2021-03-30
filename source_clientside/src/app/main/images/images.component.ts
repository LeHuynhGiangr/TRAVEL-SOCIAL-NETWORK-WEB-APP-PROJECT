import { Component, OnInit, ElementRef, Inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DOCUMENT } from '@angular/common';
import { AppUsers } from './../../login/shared/login.model';
import { Images } from '../../_core/models/images.model';
import { LoginService } from '../../_core/services/login.service';
import { ImageService } from '../../_core/services/images.service';
import { MatDialog } from '@angular/material/dialog';
import { DialogUploadAvatarComponent } from '../timeline/dialog-uploadavatar/dialog-uploadavatar.component';
import { DialogUploadBackgroundComponent } from '../timeline/dialog-uploadbackground/dialog-uploadbackground.component';
import { UserProfile } from '../../_core/data-repository/profile'
import { ImageInfo } from '../../_core/data-repository/image'
import { UriHandler } from 'src/app/_helpers/uri-handler';
import { TimelineUrl } from 'src/app/_helpers/get-timeline-url';
import {DialogShowImageComponent} from '../images/dialog-image/dialog-image.component'
import { ApiUrlConstants } from '../../../../src/app/_core/common/api-url.constants';
@Component({
    selector: 'app-images',
    templateUrl: './images.component.html',
    styleUrls: ['./images.component.css'],
    
})
export class ImagesComponent implements OnInit {

  public appUsers: AppUsers;
  public images:any
  public imageList = new Array<Images>();
  public m_returnUrl: string;
  compareId: boolean;
  play:boolean
  interval;
  time: number = 0;
  lengthcount
  count
  constructor(private m_route: ActivatedRoute, private m_router: Router, private elementRef: ElementRef,@Inject(DOCUMENT) private doc ,private service: LoginService,public dialog: MatDialog,
  public uriHandler:UriHandler,public timelineurl:TimelineUrl, public Iservice: ImageService) {
  }
  
  async ngOnInit() {
      var script = document.createElement("script");
      script.type = "text/javascript";
      script.src = "../assets/js/script.js";
      this.elementRef.nativeElement.appendChild(script);
       this.m_router.routeReuseStrategy.shouldReuseRoute = () =>{
            return false;
        }

      this.appUsers = new AppUsers();
      if(UserProfile.Id==UserProfile.IdTemp)
      {
        this.compareId =true
        this.appUsers.FirstName = this.service.getFirstNameStorage()
        this.appUsers.LastName = UserProfile.LastName
        this.appUsers.Avatar = ApiUrlConstants.API_URL+"/"+UserProfile.Avatar
        this.appUsers.Background = ApiUrlConstants.API_URL+"/"+UserProfile.Background
      }
      if(UserProfile.Id!=UserProfile.IdTemp)
      {
        this.compareId = false
        const user =await this.service.getUserById(UserProfile.IdTemp)
        this.appUsers.Id = UserProfile.IdTemp
        this.appUsers.FirstName = user["firstName"]
        this.appUsers.LastName = user["lastName"]
        this.appUsers.Avatar = ApiUrlConstants.API_URL+"/"+user["avatar"]
        this.appUsers.Background = ApiUrlConstants.API_URL+"/"+user["background"]
      }
      this.getImageList()
      this.startTimer()
    }
    startTimer() {
      this.play = true;
      this.interval = setInterval(() => {
        this.time++;
        if(this.time>=30)
        {
          this.play = false
          clearInterval(this.interval);
        }
      },50)
    }
    onLogout() {
      this.service.logout();
      this.m_router.navigateByUrl('/login');
    }
    openDialog(): void {
      const dialogRef = this.dialog.open(DialogUploadAvatarComponent, {
        width: '500px',
        height: '400px',
        data: { Id: this.appUsers.Id }
      });

      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed');
        console.log(result);
        this.service.getUser().then(user => {
          if (user) {
            this.appUsers.Avatar = user["avatar"]
            UserProfile.Avatar = user["avatar"]
          }
        });
      });
    }
    openDialogBackground(): void {
      const dialogRef = this.dialog.open(DialogUploadBackgroundComponent, {
        width: '500px',
        height: '400px',
        data: { Id: this.appUsers.Id }
      });
  
      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed');
        console.log(result);
        this.service.getUser().then(user => {
          if (user) {
            this.appUsers.Background = user["background"]
            UserProfile.Background = user["background"]
          }
        });
  
      });
    }
    showImage(id,image): void {
      const dialogRef = this.dialog.open(DialogShowImageComponent, {
        width: '500px',
        height: '400px'
      });
      ImageInfo.Id = id
      ImageInfo.Imgage = image
      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed');     
      });
    }
    getImageList = async () => {
      this.count=6
      this.images = await this.Iservice.getImageUser(UserProfile.IdTemp);
      this.lengthcount=this.images.length
      console.log(this.images.length)
      for (let i = 0; i < this.count; i++) {
          let image = new Images();
          image.Id = this.images[i].id.toString()
          image.CreatedDate = this.images[i].createdDate;
          image.Image = ApiUrlConstants.API_URL+"/"+this.images[i].mediaFile;
          image.UserId = this.images[i].userId.toString()
          this.imageList.push(image);
      }
    }
    async loadmore()
    {
      this.time=0
      this.startTimer()
      this.images = await this.Iservice.getImageUser(UserProfile.IdTemp);
      this.count=this.count+3
      for (let i = this.count-3; i < this.count; i++) {
          let image = new Images();
          image.Id = this.images[i].id.toString()
          image.CreatedDate = this.images[i].createdDate;
          image.Image = ApiUrlConstants.API_URL+"/"+this.images[i].mediaFile;
          image.UserId = this.images[i].userId.toString()
          this.imageList.push(image);
        }
    }
}
