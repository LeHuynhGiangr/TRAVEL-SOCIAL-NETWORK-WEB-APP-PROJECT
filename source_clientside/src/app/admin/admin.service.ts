import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {LoginService} from '../_core/services/login.service'
import { ApiUrlConstants } from 'src/app/_core/common/api-url.constants';
@Injectable({
    providedIn: 'root'
})
export class AdminService {
    private urlAPI :string=ApiUrlConstants.API_URL;

    constructor(private http: HttpClient,private service : LoginService) {

    }
    getAllUsers = async () => {
        try {
       
            const config = {
                headers: {
                    Authorization: this.service.getConfigToken()
                }
            }
            const result = await this.http.get(this.urlAPI + ApiUrlConstants.API_ADMIN_URL, config).toPromise();
            return result;
        }
        catch (e) {
            console.log(e);
        }
    }
    deleteUser = async (id) => {
        try {
       
            const config = {
                headers: {
                    Authorization: this.service.getConfigToken()
                }
            }
            const result = await this.http.delete(this.urlAPI + ApiUrlConstants.API_ADMIN_URL + id, config).toPromise();
            return result;
        }
        catch (e) {
            console.log(e);
        }
    }
    blockUser = async (id) => {
        try {
       
            const config = {
                headers: {
                    Authorization: this.service.getConfigToken()
                }
            }
            const result = await this.http.put(this.urlAPI + ApiUrlConstants.API_ADMIN_URL +'block/' + id, config).toPromise();
            return result;
        }
        catch (e) {
            console.log(e);
        }
    }
    getAllPages = async () => {
        try {
            const result = await this.http.get(this.urlAPI + ApiUrlConstants.API_ADMIN_PAGE).toPromise();
            return result;
        }
        catch (e) {
            console.log(e);
        }
    }
    acceptPage = async (id) => {
        try {
            return await this.http.put(this.urlAPI + ApiUrlConstants.API_ADMIN_PAGE_ACCEPT + id,null ).toPromise();            
        }
        catch (e) {
            console.log("ok");
        }
    }
    blockPage = async (id) => {
        try {
            return await this.http.put(this.urlAPI + ApiUrlConstants.API_ADMIN_PAGE_BLOCK + id,null ).toPromise();            
        }
        catch (e) {
            console.log("ok");
        }
    }
}