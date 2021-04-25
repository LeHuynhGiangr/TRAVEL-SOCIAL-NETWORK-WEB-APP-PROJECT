import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogData } from '../../../_core/models/DialogData';
import { LoginService } from '../../../_core/services/login.service';
import { ImageService } from '../../../_core/services/images.service';
import { PagesService } from '../../../_core/services/page.service';
import {Pages} from '../../../_core/models/pages.model'
import { ActivatedRoute, Router } from '@angular/router';
import { UserProfile } from '../../../_core/data-repository/profile'
import { UriHandler } from 'src/app/_helpers/uri-handler';
import { ApiUrlConstants } from '../../../_core/common/api-url.constants';
import { PageStatic } from 'src/app/_core/data-repository/page';
import { PageUrl } from 'src/app/_helpers/get-page-url';
@Component({
  selector: 'app-dialog-uploadpageavatar',
  templateUrl: './dialog-uploadpageavatar.component.html',
  styleUrls: ['./dialog-uploadpageavatar.component.css']
})
export class DialogUploadPageAvatarComponent implements OnInit {
  public avatar: File
  public m_returnUrl: string;
  url;
  public message: string;
  public pages: Pages;
  constructor(public dialogRef: MatDialogRef<DialogUploadPageAvatarComponent>, @Inject(MAT_DIALOG_DATA) public data: DialogData, private service: LoginService,
    private PService: PagesService,private m_route: ActivatedRoute,private m_router: Router,public uriHandler:UriHandler,
    public Iservice:ImageService,public pageurl:PageUrl) {

  }
  onNoClick(): void {
    this.dialogRef.close();
  }

  async ngOnInit() {
    
    this.m_router.routeReuseStrategy.shouldReuseRoute = () =>{
      return false;
    }
    console.log(PageStatic.Id)
    this.pages=new Pages()
    this.pages.Id = this.pageurl.getPageIdStorage()
    this.pages.Avatar = this.pageurl.getPageAvatarStorage()
  }

  // sửa sao thành lưu /assets/sdsad.jpg nữa chắc ok
  //display image before upload
  onSelectFile(event) {
    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();

      reader.readAsDataURL(event.target.files[0]); // read file as data url

      reader.onload = (event) => { // called once readAsDataURL is completed
        this.url = event.target.result;
      }

      // Saved Image into varible
      this.avatar = event.target.files[0];
    }
  }

  async saveImage()
  {
      const formData = new FormData();
      if (Image) {
        formData.append('MediaFile', this.avatar);
        this.Iservice.postImage(formData);
      }
      else
      {
        alert("Upload failure !")
      }

  }
  async onSave() {
    try{
      const formData = new FormData();
      formData.append('id',  this.pages.Id);
      if (Image) {
        formData.append('avatar', this.avatar);
        await this.PService.uploadAvatar(formData);
        //this.saveImage()
        alert("Upload succesfully !")
        this.dialogRef.close();
      }
      else
      {
        alert("Upload failure !")
      }
    }
    catch(e)
    {
      alert("Upload failure !")
    }
  }
  
}