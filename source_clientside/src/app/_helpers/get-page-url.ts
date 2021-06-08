import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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
        this.savePageInfoStorage(result["name"],result["avatar"],result["background"],result["address"],
        result["phoneNumber"],result["description"], result["follow"],result["userId"])
        this.m_router.navigateByUrl(this.m_returnUrl, {skipLocationChange:true});
    }
    savePageIdStorage = (pageId: string) => {
        localStorage.setItem('pageId', pageId)
    }
    savePageInfoStorage = (pageName: string, pageAvatar: string, pageBackground: string,pageAddress:string,pagePhoneNumber:string,
        pageDescription:string, pageFollow:string, ownPageId: string) => {
        localStorage.setItem('pageName', pageName)
        localStorage.setItem('pageAvatar', pageAvatar)
        localStorage.setItem('pageBackground', pageBackground)
        localStorage.setItem('pageAddress',pageAddress)
        localStorage.setItem('pagePhoneNumber', pagePhoneNumber)
        localStorage.setItem('pageDescription',pageDescription)
        localStorage.setItem('pageFollow',pageFollow)
        localStorage.setItem('ownPageId',ownPageId)
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
    getPageAddressStorage = () => {
        return localStorage.getItem('pageAddress').toString();
    }
    getPagePhoneNumberStorage = () => {
        return localStorage.getItem('pagePhoneNumber').toString();
    }
    getPageDescriptionStorage = () => {
        return localStorage.getItem('pageDescription').toString();
    }
    getPageFollowStorage = () => {
        return localStorage.getItem('pageFollow').toString();
    }
    getPageUserIdStorage = () => {
        return localStorage.getItem('ownPageId').toString();
    }
}