import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {LoginService} from './login.service'
import { ApiUrlConstants } from '../common/api-url.constants';
@Injectable({
    providedIn: 'root'
})
export class TimeLineService {
    private urlAPI :string=ApiUrlConstants.API_URL;

    constructor(private http: HttpClient,private service : LoginService) {

    }
    uploadAvatar = async (iduser, formData) => {
        try {
            // const config = {
            //     headers: {
            //         Authorization: this.service.getConfigToken()
            //     }
            // }
            return await this.http.put(this.urlAPI + ApiUrlConstants.API_UPDATE_AVATAR_URL + iduser ,formData ).toPromise();            
        }
        catch (e) {
            console.log("ok");
        }
    }
    uploadBackground = async (iduser, formData) => {
        try {
             const config = {
                headers: {
                    Authorization: this.service.getConfigToken()
                }
            }
            return await this.http.put(this.urlAPI + ApiUrlConstants.API_UPDATE_BACKGROUND_URL + iduser ,formData, config).toPromise();            
        }
        catch (e) {
            console.log("ok");
        }
    }
    setAvatarStorage = (avatar:string) => {
        localStorage.setItem('avatar', avatar)
    }
    setBackgroundStorage = (background:string) => {
        localStorage.setItem('background', background)
    }
}