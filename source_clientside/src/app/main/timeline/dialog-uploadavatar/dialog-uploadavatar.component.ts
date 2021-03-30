import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogData } from '../../../_core/models/DialogData';
import { LoginService } from '../../../_core/services/login.service';
import { ImageService } from '../../../_core/services/images.service';
import { TimeLineService } from '../../../_core/services/timeline.service';
import { AppUsers } from '../../../login/shared/login.model';
import { ActivatedRoute, Router } from '@angular/router';
import { UserProfile } from '../../../_core/data-repository/profile'
import { UriHandler } from 'src/app/_helpers/uri-handler';
import { ApiUrlConstants } from '../../../../../src/app/_core/common/api-url.constants';

@Component({
  selector: 'app-dialog-uploadavatar',
  templateUrl: './dialog-uploadavatar.component.html',
  styleUrls: ['./dialog-uploadavatar.component.css']
})
export class DialogUploadAvatarComponent implements OnInit {
  public appUsers: AppUsers;
  public avatar: File
  public m_returnUrl: string;
  url;
  public message: string;
  constructor(public dialogRef: MatDialogRef<DialogUploadAvatarComponent>, @Inject(MAT_DIALOG_DATA) public data: DialogData, private service: LoginService,
    private timeLineService: TimeLineService,private m_route: ActivatedRoute,private m_router: Router,public uriHandler:UriHandler,
    public Iservice:ImageService) {

  }
  onNoClick(): void {
    this.dialogRef.close();
  }

  async ngOnInit() {
    this.appUsers = new AppUsers();
    this.appUsers.Avatar = ApiUrlConstants.API_URL+"/"+ UserProfile.Avatar
    this.m_router.routeReuseStrategy.shouldReuseRoute = () =>{
      return false;
    }
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
        await this.Iservice.postImage(formData);
        //this.dialogRef.close();
      }
      else
      {
        alert("Upload failure !")
      }

  }
  async onSave() {
    try{
      const formData = new FormData();
      formData.append('id', this.service.getUserIdStorage());
      if (Image) {
        formData.append('avatar', this.avatar);
        await this.timeLineService.uploadAvatar(this.service.getUserIdStorage(), formData);
        this.saveImage()
        alert("Upload succesfully !")
        this.dialogRef.close();
        //this.refresh()
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