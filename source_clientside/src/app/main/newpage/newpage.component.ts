import { Component, OnInit, ElementRef, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { LoginService } from '../../_core/services/login.service';
import { UserProfile } from '../../_core/data-repository/profile'
import { PagesService } from 'src/app/_core/services/page.service'
import {Pages} from 'src/app/_core/models/pages.model'
import { ActivatedRoute, Router } from '@angular/router';
import { PrimeNGConfig } from 'primeng/api';
import { TimelineUrl } from 'src/app/_helpers/get-timeline-url';
@Component({
    selector: 'app-newpage',
    templateUrl: './newpage.component.html',
    styleUrls: ['./newpage.component.css']
})
export class NewpageComponent implements OnInit {
  public pages: Pages;
  public m_returnUrl: string;
  urlf;
  urlb;
  checkfield:boolean
  constructor(private elementRef: ElementRef,@Inject(DOCUMENT) private doc ,private service: LoginService,
  private PService:PagesService,private m_route: ActivatedRoute,private m_router: Router
  , private primengConfig: PrimeNGConfig, private timelineurl:TimelineUrl) {
    
  }
  
  async ngOnInit() {
    var script = document.createElement("script");
    script.type = "text/javascript";
    script.src = "../assets/js/script.js";
    this.elementRef.nativeElement.appendChild(script);
    this.m_router.routeReuseStrategy.shouldReuseRoute = () =>{
      return false;
    }
    this.primengConfig.ripple = true;
    this.checkfield = true;
    UserProfile.IdTemp = this.service.getUserIdStorage()
    this.pages = new Pages();
    this.pages.Description = ""
    this.pages.Address = ""
    this.pages.Name = ""
    this.pages.PhoneNumber = ""
  }
  onSelectFileFID(event) {
    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();

      reader.readAsDataURL(event.target.files[0]); // read file as data url

      reader.onload = (event) => { // called once readAsDataURL is completed
        this.urlf = event.target.result;
      }

      // Saved Image into varible
      this.pages.FImageCard = event.target.files[0];
    }
  }
  onSelectFileBID(event) {
    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();

      reader.readAsDataURL(event.target.files[0]); // read file as data url

      reader.onload = (event) => { // called once readAsDataURL is completed
        this.urlb = event.target.result;
      }

      // Saved Image into varible
      this.pages.BImageCard = event.target.files[0];
    }
  }
  createPage = async () => {
    try {
      const formData = new FormData();
      formData.append('name',this.pages.Name)
      formData.append('description',this.pages.Description)
      formData.append('address',this.pages.Address)
      formData.append('phoneNumber',this.pages.PhoneNumber)
      formData.append('fImageCard',this.pages.FImageCard)
      formData.append('bImageCard',this.pages.BImageCard)
      if(this.pages.Name == ""||this.pages.Address==""||this.pages.PhoneNumber==""||this.pages.FImageCard==null||this.pages.BImageCard==null)
      {
        this.timelineurl.showError('Please enter full information')
      }
      else
      {
        const result = await this.PService.postPage(formData);
        this.timelineurl.showSuccess('The request to create a travel page has been sent to the system !')
        setTimeout(() => {
          this.refresh()
        }, 1500)
      }
    }
    catch (e) {
      alert('Add failed');
    }
  };
  refresh(): void {
    this.m_returnUrl = this.m_route.snapshot.queryParams['returnUrl'] || '/main/home';
    this.m_router.navigateByUrl(this.m_returnUrl, {skipLocationChange:true});
    //window.location.reload();
  }
}
