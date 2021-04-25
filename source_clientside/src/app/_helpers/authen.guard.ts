import { Injectable } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { LoginService } from '../_core/services/login.service';
import { UrlConstants } from '../_core/common/url.constants';
import { UserProfile } from '../_core/data-repository/profile';
import { AuthenService } from '../_core/services/authen.service';
import { parse } from 'query-string';

@Injectable({ providedIn: 'root' })
export class AuthenGuard implements CanActivate {

    constructor(private m_router: Router, private m_authenService: AuthenService, private service: LoginService) {

    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
        //throw new Error('Method not implemented.');
        // const l_user = this.m_authenService.currentUser;
        // if(l_user){
        //     //logged in so return true
        //     return true;
        // }else{
        //     //this.m_router.navigate(['/login'], {queryParams: {returnUrl: state.url}});
        //     this.m_router.navigateByUrl("/login", {skipLocationChange:true});
        //     return false;
        // }

        // If route has query includes token, extact it and store in localStorage
        const tokenQuery = parse(location.search, { parseFragmentIdentifier: true });

        if (tokenQuery.token) {
            this.service.setToken(tokenQuery.token);
            this.service.saveIdUserStorage(tokenQuery.id as string);
            this.service.getUser();
        }

        const user = this.service.getCurrrentUser();
        if (user) {
            if (user["role"] == 1) {
                return true;
            }
            else if (user["role"] === 0) {
                //this.m_router.navigate(['/login'], {queryParams: {returnUrl: state.url}});
                this.m_router.navigateByUrl("/admin", { skipLocationChange: true });
                return false;
            }
        }

        this.m_router.navigateByUrl("/login", { skipLocationChange: true });

    }

}