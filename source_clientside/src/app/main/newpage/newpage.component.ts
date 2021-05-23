import { Component, OnInit, ElementRef, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { LoginService } from '../../_core/services/login.service';
import { UserProfile } from '../../_core/data-repository/profile'
import { PagesService } from 'src/app/_core/services/page.service'
import {Pages} from 'src/app/_core/models/pages.model'
@Component({
    selector: 'app-newpage',
    templateUrl: './newpage.component.html',
    styleUrls: ['./newpage.component.css']
})
export class NewpageComponent implements OnInit {
  public pages: Pages;
  constructor(private elementRef: ElementRef,@Inject(DOCUMENT) private doc ,private service: LoginService,
  private PService:PagesService) {
    
  }
  
  async ngOnInit() {
    var script = document.createElement("script");
    script.type = "text/javascript";
    script.src = "../assets/js/script.js";
    this.elementRef.nativeElement.appendChild(script);

    UserProfile.IdTemp = this.service.getUserIdStorage()
    this.pages = new Pages();
  }
  createPage = async (page) => {
    try {
      const result = await this.PService.postPage(page);
      alert('Add sucessfully');    
      this.pages.Name=''
      this.pages.Address=''
      this.pages.PhoneNumber=''
      this.pages.Description=''
    }
    catch (e) {
      alert('Add failed');
    }
  };
}
