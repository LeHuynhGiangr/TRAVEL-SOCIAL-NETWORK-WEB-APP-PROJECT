import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LoginService } from '../_core/services/login.service';
import { UserProfile } from './../_core/data-repository/profile'
@Injectable({
    providedIn:'root'
})
export class TimelineUrl{
    public m_returnUrl: string;
    constructor(private m_route: ActivatedRoute, private m_router: Router, private service:LoginService){}
    public getNavigationMain( id) {
        this.m_returnUrl = this.m_route.snapshot.queryParams['returnUrl'] || '/main/timeline/'+id;
        UserProfile.IdTemp = this.service.getUserIdStorage()
        this.m_router.navigateByUrl(this.m_returnUrl, {skipLocationChange:true});
    }
    public getNavigation( id) {
        this.m_returnUrl = this.m_route.snapshot.queryParams['returnUrl'] || '/main/timeline/'+id;
        this.m_router.navigateByUrl(this.m_returnUrl, {skipLocationChange:true});
    }
}