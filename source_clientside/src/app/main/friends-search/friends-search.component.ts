import { Component, OnInit, ElementRef, Inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DOCUMENT } from '@angular/common';
import { AppUsers } from './../../login/shared/login.model';
import { LoginService } from '../../_core/services/login.service';
import { SearchService } from '../../_core/services/friends-search.service';
import { UriHandler } from 'src/app/_helpers/uri-handler';
import { UserProfile } from 'src/app/_core/data-repository/profile';
import { ApiUrlConstants } from '../../../../src/app/_core/common/api-url.constants';
@Component({
    selector: 'app-friends-search',
    templateUrl: './friends-search.component.html',
    styleUrls: ['./friends-search.component.css']
})
export class FriendsSearchComponent implements OnInit {

    public appUsers: AppUsers;
    public users:any
    public m_returnUrl: string;
    public userList = new Array<AppUsers>();
    constructor(private elementRef: ElementRef,@Inject(DOCUMENT) private doc ,private service: LoginService
    ,public uriHandler:UriHandler, public Sservice:SearchService,private m_route: ActivatedRoute, private m_router: Router) {}
    async ngOnInit() {
        var script = document.createElement("script");
        script.type = "text/javascript";
        script.src = "../assets/js/script.js";
        this.elementRef.nativeElement.appendChild(script);
        this.getUserList()
        this.m_router.routeReuseStrategy.shouldReuseRoute = () =>{
            return false;
        }
    }
    onLogout() {
        this.service.logout();
        this.m_router.navigateByUrl('/login');
    }
    public getUserList = async () => {
        this.users = await this.Sservice.getAllUsersByName(UserProfile.Name);
        for (let i = 0; i < this.users.length; i++) {
            let user = new AppUsers();
            user.Id = this.users[i].id.toString();
            user.FirstName = this.users[i].firstName;
            user.LastName = this.users[i].lastName;
            user.Descriptions = this.users[i].description
            user.Avatar = ApiUrlConstants.API_URL+"/"+this.users[i].avatar
            if(this.users[i].id==this.service.getUserIdStorage())
            {
                console.log("trung roi")
            }
            else
            {
                this.userList.push(user);
            }
        }
      }

    getNavigation( id) {
        this.m_returnUrl = this.m_route.snapshot.queryParams['returnUrl'] || '/main/timeline/'+id;
        UserProfile.IdTemp = id.toString()
        this.m_router.navigateByUrl(this.m_returnUrl, {skipLocationChange:true});
    }
}
