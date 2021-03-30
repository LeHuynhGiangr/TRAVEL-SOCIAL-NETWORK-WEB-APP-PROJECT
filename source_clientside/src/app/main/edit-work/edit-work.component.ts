import { Component, OnInit, ElementRef, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { AppUsers } from './../../login/shared/login.model';
import { LoginService } from '../../_core/services/login.service';
import { EditWorkService } from '../../_core/services/edit-work.service';
import { ActivatedRoute, Router } from '@angular/router';
import { UserProfile } from '../../_core/data-repository/profile'
@Component({
  selector: 'app-edit-work',
  templateUrl: './edit-work.component.html',
  styleUrls: ['./edit-work.component.css'],
  
})
export class EditWorkComponent implements OnInit {

  public appUsers: AppUsers;
  public m_returnUrl: string;
  constructor(private router: Router, private elementRef: ElementRef, @Inject(DOCUMENT) private doc, private service: LoginService,
    private EWService: EditWorkService, private m_router: Router, private m_route: ActivatedRoute) {

  }

  async ngOnInit() {
    var script = document.createElement("script");
    script.type = "text/javascript";
    script.src = "../assets/js/script.js";
    this.elementRef.nativeElement.appendChild(script);


    this.appUsers = new AppUsers();

    this.appUsers.AcademicLevel = UserProfile.AcademicLevel
    this.appUsers.AddressAcademic = UserProfile.AddressAcademic
    this.appUsers.DescriptionAcademic = UserProfile.DescriptionAcademic
    this.appUsers.StudyingAt = UserProfile.StudyingAt
    this.appUsers.FromDate = UserProfile.FromDate
    this.appUsers.ToDate = UserProfile.ToDate
  }
    getPath() {
      return this.router.url;
    }
    onFileChanged(event) {
      this.appUsers.Avatar = event.target.files[0]
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
        formData.append('id', this.service.getUserIdStorage());
        if (1) {
          formData.append('academicLevel', this.appUsers.AcademicLevel);
          formData.append('studyingAt', this.appUsers.StudyingAt);
          formData.append('descriptionAcademic', this.appUsers.DescriptionAcademic);
          formData.append('addressAcademic', this.appUsers.AddressAcademic);
          formData.append('fromDate', this.appUsers.FromDate.toString());
          formData.append('toDate', this.appUsers.ToDate.toString());
          this.EWService.updateAcademic(this.service.getUserIdStorage(), formData);
          alert("Upload succesfully !")

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
}
