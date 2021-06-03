import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogData } from '../../../_core/models/DialogData';
import { LoginService } from '../../../_core/services/login.service';
import { TimeLineService } from '../../../_core/services/timeline.service';
import { AppUsers } from '../../../login/shared/login.model';
import { UserProfile } from '../../../_core/data-repository/profile'
import { UriHandler } from 'src/app/_helpers/uri-handler';
import { ImageService } from '../../../_core/services/images.service';
import { ApiUrlConstants } from '../../../../../src/app/_core/common/api-url.constants';
import { PrimeNGConfig } from 'primeng/api';
import { TimelineUrl } from 'src/app/_helpers/get-timeline-url';
@Component({
  selector: 'app-dialog-uploadbackground',
  templateUrl: './dialog-uploadbackground.component.html',
  styleUrls: ['./dialog-uploadbackground.component.css'],
})
export class DialogUploadBackgroundComponent implements OnInit {
  public appUsers: AppUsers;
  public background: File
  public m_returnUrl: string;
  url;
  public message: string;
  constructor(public dialogRef: MatDialogRef<DialogUploadBackgroundComponent>, @Inject(MAT_DIALOG_DATA) public data: DialogData, private service: LoginService,
    private timeLineService: TimeLineService,public uriHandler:UriHandler,
    public Iservice:ImageService, private primengConfig: PrimeNGConfig, private timelineurl:TimelineUrl) {

  }
  onNoClick(): void {
    this.dialogRef.close();
  }

  async ngOnInit() {
    this.appUsers = new AppUsers();
    this.appUsers.Background = ApiUrlConstants.API_URL+"/"+UserProfile.Background
    this.primengConfig.ripple = true;
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
      if (this.background != null) {
        formData.append('MediaFile', this.background);
        await this.Iservice.postImage(formData);
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
      formData.append('id', this.service.getUserIdStorage());
      formData.append('background', this.background);
      if(this.background == null)
      {
        this.timelineurl.showError("Upload failure !")
        setTimeout(() => {
          this.dialogRef.close();
        }, 1000)
      }
      else
      {
        await this.timeLineService.uploadBackground(this.service.getUserIdStorage(), formData);
        this.saveImage()
        this.timelineurl.showSuccess("Upload successfully !")
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