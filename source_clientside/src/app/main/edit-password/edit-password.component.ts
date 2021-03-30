import { Component, OnInit, ElementRef, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { AppUsers } from './../../login/shared/login.model';
import { EditPasswordService } from '../../_core/services/edit-password.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { LoginService } from 'src/app/_core/services/login.service';
@Component({
    selector: 'app-edit-password',
    templateUrl: './edit-password.component.html',
    styleUrls: ['./edit-password.component.css'],
    
})
export class EditPasswordComponent implements OnInit {

  public appUsers: AppUsers;
  public m_returnUrl: string;
  constructor(private elementRef: ElementRef,@Inject(DOCUMENT) private doc, public dialog: MatDialog,
  private EPservice:EditPasswordService,private m_route: ActivatedRoute, private m_router: Router,private service: LoginService) {
    
  }
  
  async ngOnInit() {
    var script = document.createElement("script");
    script.type = "text/javascript";
    script.src = "../assets/js/script.js";
    this.elementRef.nativeElement.appendChild(script);
  }
  async onSave() {
    try{
      const formData = new FormData();
      formData.append('id', this.service.getUserIdStorage());
      if (1) {
        formData.append('password', this.appUsers.Password);
        formData.append('confirmPassword', this.appUsers.ConfirmPassword);
        if (this.appUsers.Password !== this.appUsers.ConfirmPassword) {
          return alert('Password not match a confirm password');
        }
        else
        {
          this.EPservice.changePassword(this.service.getUserIdStorage(),formData);
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
}
