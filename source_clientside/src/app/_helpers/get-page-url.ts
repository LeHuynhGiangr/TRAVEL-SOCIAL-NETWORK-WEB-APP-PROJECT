import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PageStatic } from './../_core/data-repository/page'
import { PagesService } from './../_core/services/page.service';
@Injectable({
    providedIn:'root'
})
export class PageUrl{
    public m_returnUrl: string;
    constructor(private m_route: ActivatedRoute, private m_router: Router,private PService:PagesService){}
    public async getNavigation( id) {
        this.m_returnUrl = this.m_route.snapshot.queryParams['returnUrl'] || '/main/fanpage/'+id;
        this.savePageIdStorage(id);

        const result = await this.PService.getPageById(id);
        this.savePageInfoStorage(result["name"],result["avatar"],result["background"])
        this.m_router.navigateByUrl(this.m_returnUrl, {skipLocationChange:true});
    }
    savePageIdStorage = (pageId: string) => {
        localStorage.setItem('pageId', pageId)
    }
    savePageInfoStorage = (pageName: string, pageAvatar: string, pageBackground: string) => {
        localStorage.setItem('pageName', pageName)
        localStorage.setItem('pageAvatar', pageAvatar)
        localStorage.setItem('pageBackground', pageBackground)
    }
    getPageIdStorage = () => {
        return localStorage.getItem('pageId').toString();
    }
    getPageNameStorage = () => {
        return localStorage.getItem('pageName').toString();
    }
    getPageAvatarStorage = () => {
        return localStorage.getItem('pageAvatar').toString();
    }
    getPageBackgroundStorage = () => {
        return localStorage.getItem('pageBackground').toString();
    }
}