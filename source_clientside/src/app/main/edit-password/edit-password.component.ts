import { Component, OnInit, ElementRef, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { AppUsers } from './../../login/shared/login.model';
import { LoginService } from '../../_core/services/login.service';
import { EditPasswordService } from '../../_core/services/edit-password.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { DialogUploadAvatarComponent } from '../timeline/dialog-uploadavatar/dialog-uploadavatar.component';
import { DialogUploadBackgroundComponent } from '../timeline/dialog-uploadbackground/dialog-uploadbackground.component';
import { UserProfile } from '../../_core/data-repository/profile'
import { UriHandler } from 'src/app/_helpers/uri-handler';
import { TimelineUrl } from 'src/app/_helpers/get-timeline-url';
import { ApiUrlConstants } from '../../../../src/app/_core/common/api-url.constants';
@Component({
    selector: 'app-edit-password',
    templateUrl: './edit-password.component.html',
    styleUrls: ['./edit-password.component.css'],
    
})
export class EditPasswordComponent implements OnInit {

  public appUsers: AppUsers;
  public m_returnUrl: string;
  constructor(private router: Router, private elementRef: ElementRef,@Inject(DOCUMENT) private doc ,private service: LoginService,public dialog: MatDialog,
  private EPservice:EditPasswordService,private m_route: ActivatedRoute, private m_router: Router,public uriHandler:UriHandler, public timelineurl:TimelineUrl) {
    
  }
  
  async ngOnInit() {
    var script = document.createElement("script");
    script.type = "text/javascript";
    script.src = "../assets/js/script.js";
    this.elementRef.nativeElement.appendChild(script);

    this.appUsers = new AppUsers();
    //var user = await this.service.getUser();
    this.appUsers.Id = UserProfile.Id
    //console.log(user["firstName"]+" "+user["lastName"]);
    this.appUsers.FirstName = this.service.getFirstNameStorage()
    this.appUsers.LastName = UserProfile.LastName
    this.appUsers.Avatar = ApiUrlConstants.API_URL+"/"+UserProfile.Avatar
    this.appUsers.Background = ApiUrlConstants.API_URL+"/"+UserProfile.Background
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
          this.appUsers.Id = UserProfile.Id
          this.appUsers.Avatar = UserProfile.Avatar
        }
      });
    });
  }
  async onSave() {
    try{
      const formData = new FormData();
      formData.append('id', this.appUsers.Id);
      if (1) {
        formData.append('password', this.appUsers.Password);
        formData.append('confirmPassword', this.appUsers.ConfirmPassword);
        if (this.appUsers.Password !== this.appUsers.ConfirmPassword) {
          return alert('Password not match a confirm password');
        }
        else
        {
          this.EPservice.changePassword(this.appUsers.Id,formData);
          alert("Upload succesfully !")
          this.refresh();
        }
        
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
    this.m_returnUrl = this.m_route.snapshot.queryParams['returnUrl'] || '/main/about';
    this.m_router.navigateByUrl(this.m_returnUrl, {skipLocationChange:true});
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
          this.appUsers.Id = UserProfile.Id
          this.appUsers.Background = UserProfile.Background
        }
      });

    });
  }
}
