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
@Component({
  selector: 'app-dialog-uploadbackground',
  templateUrl: './dialog-uploadbackground.component.html',
  styleUrls: ['./dialog-uploadbackground.component.css']
})
export class DialogUploadBackgroundComponent implements OnInit {
  public appUsers: AppUsers;
  public background: File
  public m_returnUrl: string;
  url;
  public message: string;
  constructor(public dialogRef: MatDialogRef<DialogUploadBackgroundComponent>, @Inject(MAT_DIALOG_DATA) public data: DialogData, private service: LoginService,
    private timeLineService: TimeLineService,private m_route: ActivatedRoute,private m_router: Router,public uriHandler:UriHandler,
    public Iservice:ImageService) {

  }
  onNoClick(): void {
    this.dialogRef.close();
  }

  async ngOnInit() {
    this.appUsers = new AppUsers();
    //var user = await this.service.getUser();
    this.appUsers.Background = ApiUrlConstants.API_URL+"/"+UserProfile.Background
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
        formData.append('background', this.background);
        await this.timeLineService.uploadBackground(this.service.getUserIdStorage(), formData);
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
  
  refresh(): void {
    this.m_returnUrl = this.m_route.snapshot.queryParams['returnUrl'] || '/main/images';
    this.m_router.navigateByUrl(this.m_returnUrl, {skipLocationChange:true});
    //window.location.reload();
  }
}