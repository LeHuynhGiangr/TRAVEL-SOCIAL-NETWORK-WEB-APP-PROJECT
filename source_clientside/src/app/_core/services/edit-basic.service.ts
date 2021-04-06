import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {LoginService} from './login.service'
import { ApiUrlConstants } from '../common/api-url.constants';
import { BehaviorSubject } from 'rxjs';
import { UserProfile } from '../data-repository/profile';
@Injectable({
    providedIn: 'root'
})
export class EditBasicService {
    private urlAPI :string=ApiUrlConstants.API_URL;
    private currentUser: BehaviorSubject<any>
    constructor(private http: HttpClient, private service : LoginService) {
        
    }
    public uploadProfile = async (iduser, formData) => {
        try {
            console.log(iduser);
             const config = {
                headers: {
                    Authorization: this.service.getConfigToken()
                }
            }
            return await this.http.put(this.urlAPI + ApiUrlConstants.API_UPDATE_PROFILE_URL + iduser ,formData, config).toPromise(); 
        }
        catch (e) {
            console.log(e);
        }
    }
    getUser = async () => {
        try {
            const result = await this.http.get(this.urlAPI + ApiUrlConstants.API_LOAD_MAINUSER_URL).toPromise();
            this.currentUser.next(result);
            return result;
        }
        catch (e) {
            console.log(e);
            // this.removeToken();
        }
    }
    setUserInfoStorage = (firstName:string, lastName:string) => {
        localStorage.setItem('firstName',firstName)
        localStorage.setItem('lastName',lastName)
    }
}