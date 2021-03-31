import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogData } from '../../../_core/models/DialogData';
import { LoginService } from '../../../_core/services/login.service';
import { ImageService } from '../../../_core/services/images.service';
import { TimeLineService } from '../../../_core/services/timeline.service';
import { AppUsers } from '../../../login/shared/login.model';
import { Router } from '@angular/router';
import { UriHandler } from 'src/app/_helpers/uri-handler';
import { ApiUrlConstants } from '../../../../../src/app/_core/common/api-url.constants';
import { MessageService } from 'primeng/api';
import { PrimeNGConfig } from 'primeng/api';

@Component({
  selector: 'app-dialog-uploadavatar',
  templateUrl: './dialog-uploadavatar.component.html',
  styleUrls: ['./dialog-uploadavatar.component.css'],
  providers: [MessageService]
})
export class DialogUploadAvatarComponent implements OnInit {
  public appUsers: AppUsers;
  public avatar: File
  public m_returnUrl: string;
  url;
  public message: string;
  constructor(public dialogRef: MatDialogRef<DialogUploadAvatarComponent>, @Inject(MAT_DIALOG_DATA) public data: DialogData, private service: LoginService,
    private timeLineService: TimeLineService,private m_router: Router,public uriHandler:UriHandler,
    public Iservice:ImageService, private messageService: MessageService, private primengConfig: PrimeNGConfig) {

  }
  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit() {
    this.m_router.routeReuseStrategy.shouldReuseRoute = () =>{
      return false;
    }
    this.appUsers = new AppUsers();
    this.appUsers.Avatar = ApiUrlConstants.API_URL+"/"+ this.service.getAvatarStorage()
    this.primengConfig.ripple = true;
  }
  showSuccess() {
    this.messageService.add({severity:'success', summary: 'Success', detail: 'Message Content'});
    setTimeout(() => {
      this.dialogRef.close();
   }, 1000)
  }
  showError() {
    this.messageService.add({severity:'error', summary: 'Error', detail: 'Message Content'});
    setTimeout(() => {
      this.dialogRef.close();
    }, 1000)
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
      this.avatar = event.target.files[0];
    }
  }

  async saveImage()
  {
      const formData = new FormData();
      if (Image) {
        formData.append('MediaFile', this.avatar);
        await this.Iservice.postImage(formData);
      }
      else
      {
        this.showError()
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
        this.showSuccess()
      }
      else
      {
        this.showError()
      }
    }
    catch(e)
    {
      this.showError()
    }
  }
  
}