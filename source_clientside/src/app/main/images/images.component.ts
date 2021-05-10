import { Component, OnInit, ElementRef, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { DOCUMENT } from '@angular/common';
import { Images } from '../../_core/models/images.model';
import { ImageService } from '../../_core/services/images.service';
import { MatDialog } from '@angular/material/dialog';
import { UserProfile } from '../../_core/data-repository/profile'
import { ImageInfo } from '../../_core/data-repository/image'
import {DialogShowImageComponent} from '../images/dialog-image/dialog-image.component'
import { ApiUrlConstants } from '../../../../src/app/_core/common/api-url.constants';
@Component({
    selector: 'app-images',
    templateUrl: './images.component.html',
    styleUrls: ['./images.component.css'],
    
})
export class ImagesComponent implements OnInit {

  public images:any
  public imageList = new Array<Images>();
  public m_returnUrl: string;
  play:boolean
  interval;
  time: number = 0;
  lengthcount
  count
  constructor(private m_router: Router, private elementRef: ElementRef,@Inject(DOCUMENT) private doc, public dialog: MatDialog,
  public Iservice: ImageService) {
  }
  
  async ngOnInit() {
      var script = document.createElement("script");
      script.type = "text/javascript";
      script.src = "../assets/js/script.js";
      this.elementRef.nativeElement.appendChild(script);
       this.m_router.routeReuseStrategy.shouldReuseRoute = () =>{
            return false;
        }
      this.getImageList()
      this.startTimer()
    }
    startTimer() {
      this.play = true;
      this.interval = setInterval(() => {
        this.time++;
        if(this.time >= 30)
        {
          this.play = false
          clearInterval(this.interval);
        }
      },50)
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
      this.count = 6
      this.images = await this.Iservice.getImageUser(UserProfile.IdTemp);
      this.lengthcount = this.images.length
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
      this.time = 0
      this.startTimer()
      this.images = await this.Iservice.getImageUser(UserProfile.IdTemp);
      this.count = this.count + 3
      for (let i = this.count - 3; i < this.count; i++) {
          let image = new Images();
          image.Id = this.images[i].id.toString()
          image.CreatedDate = this.images[i].createdDate;
          image.Image = ApiUrlConstants.API_URL + "/" + this.images[i].mediaFile;
          image.UserId = this.images[i].userId.toString()
          this.imageList.push(image);
        }
    }
}
