import { Component, OnInit, ElementRef, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { AppUsers } from './../../login/shared/login.model';
import { LoginService } from '../../_core/services/login.service';
import { MatDialog } from '@angular/material/dialog';
import { DialogUploadAvatarComponent } from '../timeline/dialog-uploadavatar/dialog-uploadavatar.component';
import { EditWorkService } from '../../_core/services/edit-work.service';
import { ActivatedRoute, Router } from '@angular/router';
import { DialogUploadBackgroundComponent } from '../timeline/dialog-uploadbackground/dialog-uploadbackground.component';
import { UserProfile } from '../../_core/data-repository/profile'
import { UriHandler } from 'src/app/_helpers/uri-handler';
import { TimelineUrl } from 'src/app/_helpers/get-timeline-url';
import { ApiUrlConstants } from '../../../../src/app/_core/common/api-url.constants';
@Component({
  selector: 'app-edit-work',
  templateUrl: './edit-work.component.html',
  styleUrls: ['./edit-work.component.css'],
  
})
export class EditWorkComponent implements OnInit {

  public appUsers: AppUsers;
  public m_returnUrl: string;
  constructor(private router: Router, private elementRef: ElementRef, @Inject(DOCUMENT) private doc, private service: LoginService, public dialog: MatDialog,
    private EWService: EditWorkService, private m_router: Router, private m_route: ActivatedRoute,public uriHandler:UriHandler,public timelineurl:TimelineUrl) {

  }

  async ngOnInit() {
    var script = document.createElement("script");
    script.type = "text/javascript";
    script.src = "../assets/js/script.js";
    this.elementRef.nativeElement.appendChild(script);


    this.appUsers = new AppUsers();
    //var user = await this.service.getUser();
    this.appUsers.Id = UserProfile.Id.toString();
    //console.log(user["firstName"] + " " + user["lastName"]);
    this.appUsers.FirstName = this.service.getFirstNameStorage()
    this.appUsers.LastName = UserProfile.LastName
    this.appUsers.Avatar = ApiUrlConstants.API_URL+"/"+UserProfile.Avatar
    this.appUsers.AcademicLevel = UserProfile.AcademicLevel
    this.appUsers.AddressAcademic = UserProfile.AddressAcademic
    this.appUsers.DescriptionAcademic = UserProfile.DescriptionAcademic
    this.appUsers.StudyingAt = UserProfile.StudyingAt
    this.appUsers.FromDate = UserProfile.FromDate
    this.appUsers.ToDate = UserProfile.ToDate
    this.appUsers.Background = ApiUrlConstants.API_URL+"/"+UserProfile.Background
  }
    getPath() {
      return this.router.url;
    }
    onFileChanged(event) {
      this.appUsers.Avatar = event.target.files[0]
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
            //console.log(user["firstName"] + " " + user["lastName"]);
            this.appUsers.Id = UserProfile.Id.toString()
            this.appUsers.Avatar = UserProfile.Avatar
          }
        });
      });
    }
    selectChangeHandler(value: any) {
      //update the ui
      console.log('!!', value);
      this.appUsers.AcademicLevel = value;
    }
    async onSave() {
      try {
        const lelveElement = document.querySelector("#level");
        this.appUsers.AcademicLevel = (<HTMLInputElement>lelveElement).value;
        const formData = new FormData();
        formData.append('id', UserProfile.Id);
        if (1) {
          formData.append('academicLevel', this.appUsers.AcademicLevel);
          formData.append('studyingAt', this.appUsers.StudyingAt);
          formData.append('descriptionAcademic', this.appUsers.DescriptionAcademic);
          formData.append('addressAcademic', this.appUsers.AddressAcademic);
          formData.append('fromDate', this.appUsers.FromDate.toString());
          formData.append('toDate', this.appUsers.ToDate.toString());
          this.EWService.updateAcademic(UserProfile.Id.toString(), formData);
          alert("Upload succesfully !")

          //Refresh user after edit interest
          //var user = await this.service.getUser();
          UserProfile.AcademicLevel = this.appUsers.AcademicLevel
          UserProfile.StudyingAt = this.appUsers.StudyingAt
          UserProfile.DescriptionAcademic = this.appUsers.DescriptionAcademic
          UserProfile.AddressAcademic = this.appUsers.AddressAcademic
          UserProfile.FromDate = this.appUsers.FromDate
          UserProfile.ToDate = this.appUsers.ToDate
          this.refresh();
        }
        else {
          alert("Upload failure !")
        }
      }
      catch (e) {
        alert("Upload failure !")
      }
    }
    refresh(): void {
      this.m_returnUrl = this.m_route.snapshot.queryParams['returnUrl'] || '/main/about';
      this.m_router.navigateByUrl(this.m_returnUrl, { skipLocationChange: true });
      //window.location.reload();
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
            console.log(user["firstName"] + " " + user["lastName"]);
            this.appUsers.Id = UserProfile.Id.toString()
            this.appUsers.Background = UserProfile.Background
          }
        });
  
      });
    }
}
