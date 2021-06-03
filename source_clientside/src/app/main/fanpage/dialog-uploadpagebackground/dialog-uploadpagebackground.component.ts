import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogData } from '../../../_core/models/DialogData';
import { PagesService } from '../../../_core/services/page.service';
import { Router } from '@angular/router';
import { UriHandler } from 'src/app/_helpers/uri-handler';
import { ImageService } from '../../../_core/services/images.service';
import {Pages} from '../../../_core/models/pages.model'
import { PageUrl } from 'src/app/_helpers/get-page-url';
import { TimelineUrl } from 'src/app/_helpers/get-timeline-url';
import { PrimeNGConfig } from 'primeng/api';
@Component({
  selector: 'app-dialog-uploadpagebackground',
  templateUrl: './dialog-uploadpagebackground.component.html',
  styleUrls: ['./dialog-uploadpagebackground.component.css']
})
export class DialogUploadPageBackgroundComponent implements OnInit {
  public background: File
  public m_returnUrl: string;
  url;
  public message: string;
  public pages: Pages;
  constructor(public dialogRef: MatDialogRef<DialogUploadPageBackgroundComponent>, @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private PService: PagesService,private m_router: Router,public uriHandler:UriHandler,
    public Iservice:ImageService,public pageurl:PageUrl,private timelineurl:TimelineUrl, private primengConfig: PrimeNGConfig) {

  }
  onNoClick(): void {
    this.dialogRef.close();
  }

  async ngOnInit() {
    this.m_router.routeReuseStrategy.shouldReuseRoute = () =>{
      return false;
    }
    this.primengConfig.ripple = true;
    this.pages=new Pages()
    this.pages.Id = this.pageurl.getPageIdStorage()
    this.pages.Background = this.pageurl.getPageBackgroundStorage()

  }

  //display image before upload
  onSelectFile(event) {
    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();

      reader.readAsDataURL(event.target.files[0]); // read file as data url

      reader.onload = (event) => { // called once readAsDataURL is completed
        this.url = event.target.result;
      }

      // Saved Image into varible
      this.background = event.target.files[0];
    }
  }
  async saveImage()
  {
      const formData = new FormData();
      if (Image) {
        formData.append('MediaFile', this.background);
        this.Iservice.postImage(formData);
      }
      else
      {
        this.timelineurl.showError("Save image in gallery failure !")
        setTimeout(() => {
          this.dialogRef.close();
        }, 1000)
      }

  }
  async onSave() {
    try{
      const formData = new FormData();
      formData.append('id', this.pages.Id);
      formData.append('background', this.background);
      if (this.background != null) {
        await this.PService.uploadBackground(formData);
        //this.saveImage()
        this.timelineurl.showSuccess("Upload successfully !")
        setTimeout(() => {
          this.dialogRef.close();
        }, 1000)
      }
      else
      {
        this.timelineurl.showError("Upload failure !")
        setTimeout(() => {
          this.dialogRef.close();
        }, 1000)
      }
    }
    catch(e)
    {
      this.timelineurl.showError(e)
        setTimeout(() => {
          this.dialogRef.close();
        }, 1000)
    }
  }
}