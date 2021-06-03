import { Component, OnInit, ElementRef, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { DOCUMENT } from '@angular/common';
import { LoginService } from '../../_core/services/login.service';
import { PagesService } from '../../_core/services/page.service';
import {Pages} from '../../_core/models/pages.model'
import {PageUrl} from 'src/app/_helpers/get-page-url'
import { ApiUrlConstants } from '../../../../src/app/_core/common/api-url.constants';
import { PrimeNGConfig } from 'primeng/api';
@Component({
    selector: 'app-groups-search',
    templateUrl: './groups-search.component.html',
    styleUrls: ['./groups-search.component.css']
})
export class GroupsSearchComponent implements OnInit {
    public pages:any
    public m_returnUrl: string;
    public pageList = new Array<Pages>();
    displayPosition: boolean;
    position: string;
    constructor(private router: Router, private elementRef: ElementRef,@Inject(DOCUMENT) private doc,private service: LoginService,
    private PService:PagesService, public pageurl:PageUrl,private primengConfig: PrimeNGConfig ) {}

    ngOnInit() {
      var script = document.createElement("script");
      script.type = "text/javascript";
      script.src = "../assets/js/script.js";
      this.elementRef.nativeElement.appendChild(script);
      this.primengConfig.ripple = true;
      this.getMyListPages()
    }
    async getMyListPages(){
      this.pages = await this.PService.getAllPages();
        for (let i = 0; i < this.pages.length; i++) {
            let page = new Pages();
            page.Id = this.pages[i].id.toString();
            page.Name = this.pages[i].name;
            page.Follow = this.pages[i].follow;
            page.Description = this.pages[i].description
            page.Active = this.pages[i].active
            page.RequestCreate = this.pages[i].requestCreate
            page.Avatar = ApiUrlConstants.API_URL+"/"+this.pages[i].avatar
            page.Background = ApiUrlConstants.API_URL+"/"+this.pages[i].background
            this.pageList.push(page);
        }
    }
    onLogout() {
      this.service.logout();
      this.router.navigateByUrl('/login');
    }
    showPositionDialog() {
      this.position = "top";
      this.displayPosition = true;
    }
}
