import { Component, Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LoginService } from '../_core/services/login.service';
import { UserProfile } from './../_core/data-repository/profile'
import { MessageService } from 'primeng/api';
import { PrimeNGConfig } from 'primeng/api';
@Injectable({
    providedIn:'root'
})
export class TimelineUrl{
    public m_returnUrl: string;
    constructor(private m_route: ActivatedRoute, private m_router: Router, private service:LoginService, private messageService: MessageService, private primengConfig: PrimeNGConfig){
        this.primengConfig.ripple = true;
    }
    public getNavigationMain( id) {
        this.m_returnUrl = this.m_route.snapshot.queryParams['returnUrl'] || '/main/timeline/'+id;
        UserProfile.IdTemp = this.service.getUserIdStorage()
        this.m_router.navigateByUrl(this.m_returnUrl, {skipLocationChange:true});
    }
    public getNavigation( id) {
        this.m_returnUrl = this.m_route.snapshot.queryParams['returnUrl'] || '/main/timeline/'+id;
        UserProfile.IdTemp = id
        this.m_router.navigateByUrl(this.m_returnUrl, {skipLocationChange:true});
    }
    public showSuccess(message) {
        this.messageService.add({severity:'success', summary: 'Success', detail:message});
      }
    public showError(message) {
        this.messageService.add({severity:'error', summary: 'Error', detail: message});
    }
}