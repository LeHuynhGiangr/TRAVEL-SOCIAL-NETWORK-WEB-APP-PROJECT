import { Component, OnInit, ElementRef, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { DOCUMENT } from '@angular/common';
import { UserProfile } from 'src/app/_core/data-repository/profile';
import { LoginService } from 'src/app/_core/services/login.service';

@Component({
    selector: 'app-groups',
    templateUrl: './groups.component.html',
    styleUrls: ['./groups.component.css'],   
})
export class GroupsComponent implements OnInit {
  compareId: boolean;
  constructor(private m_router: Router, private elementRef: ElementRef,@Inject(DOCUMENT) private doc, private service: LoginService) 
  {  
  }
  
  async ngOnInit() {
      var script = document.createElement("script");
      script.type = "text/javascript";
      script.src = "../assets/js/script.js";
      this.elementRef.nativeElement.appendChild(script);
      this.m_router.routeReuseStrategy.shouldReuseRoute = () =>{
        return false;
      }
      if(this.service.getUserIdStorage()==UserProfile.IdTemp)
        this.compareId = true
      else
        this.compareId = false
    }
}
