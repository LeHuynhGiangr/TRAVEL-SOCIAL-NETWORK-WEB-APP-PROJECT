import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogData } from '../../../_core/models/DialogData';
import { LoginService } from '../../../_core/services/login.service';
import { TimeLineService } from '../../../_core/services/timeline.service';
import { AppUsers } from '../../../login/shared/login.model';
import { ActivatedRoute, Router } from '@angular/router';
import { UserProfile } from '../../../_core/data-repository/profile'
import { UriHandler } from 'src/app/_helpers/uri-handler';
import { ImageService } from '../../../_core/services/images.service';
import { ApiUrlConstants } from '../../../../../src/app/_core/common/api-url.constants';
import { MessageService } from 'primeng/api';
import { PrimeNGConfig } from 'primeng/api';
@Component({
  selector: 'app-dialog-uploadbackground',
  templateUrl: './dialog-uploadbackground.component.html',
  styleUrls: ['./dialog-uploadbackground.component.css'],
  providers: [MessageService]
})
export class DialogUploadBackgroundComponent implements OnInit {
  public appUsers: AppUsers;
  public background: File
  public m_returnUrl: string;
  url;
  public message: string;
  constructor(public dialogRef: MatDialogRef<DialogUploadBackgroundComponent>, @Inject(MAT_DIALOG_DATA) public data: DialogData, private service: LoginService,
    private timeLineService: TimeLineService,private m_route: ActivatedRoute,private m_router: Router,public uriHandler:UriHandler,
    public Iservice:ImageService, private messageService: MessageService, private primengConfig: PrimeNGConfig) {

  }
  onNoClick(): void {
    this.dialogRef.close();
  }

  async ngOnInit() {
    this.appUsers = new AppUsers();
    this.appUsers.Background = ApiUrlConstants.API_URL+"/"+UserProfile.Background
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
      this.background = event.target.files[0];
    }
  }
  async saveImage()
  {
      const formData = new FormData();
      if (Image) {
        formData.append('MediaFile', this.background);
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
        formData.append('background', this.background);
        await this.timeLineService.uploadBackground(this.service.getUserIdStorage(), formData);
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