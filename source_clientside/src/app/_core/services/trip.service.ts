import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {LoginService} from './login.service'
import { ApiUrlConstants } from '../common/api-url.constants';
@Injectable({
    providedIn: 'root'
})
export class TripService {
    private urlAPI :string=ApiUrlConstants.API_URL;

    constructor(private http: HttpClient,private service : LoginService) {

    }
    createTrip = async (formData) => {
        try {
             const config = {
                headers: {
                    Authorization: this.service.getConfigToken()
                }
            }
            return await this.http.post(this.urlAPI + ApiUrlConstants.API_TRIP_URL ,formData, config).toPromise();            
        }
        catch (e) {
            console.log("ok");
        }
    }
    getTripDetail = async (id) => {
        try {
       
            const config = {
                headers: {
                    Authorization: this.service.getConfigToken()
                }
            }
            const result = await this.http.get(this.urlAPI + ApiUrlConstants.API_TRIP_URL+id, config).toPromise();
            console.log(result)
            return result;
        }
        catch (e) {
            console.log(e);
        }
    }
    getAllTrips = async () => {
        try {   
            const result = await this.http.get(this.urlAPI + ApiUrlConstants.API_TRIP_URL).toPromise();
            return result;
        }
        catch (e) {
            console.log(e);
        }
    }
    getAllTripsByPageId = async (id) => {
        try {
       
            const config = {
                headers: {
                    Authorization: this.service.getConfigToken()
                }
            }
            const result = await this.http.get(this.urlAPI + ApiUrlConstants.API_TRIPLOAD_URL+id, config).toPromise();
            console.log(result)
            return result;
        }
        catch (e) {
            console.log(e);
        }
    }
    getFriendInTrip = async (id) => {
        try {
       
            const config = {
                headers: {
                    Authorization: this.service.getConfigToken()
                }
            }
            const result = await this.http.get(this.urlAPI + ApiUrlConstants.API_FRIENDSINTRIPLOAD_URL + id, config).toPromise();
            return result;
        }
        catch (e) {
            console.log(e);
        }
    }
    addUserInTrip = async (formData) => {
        try {
            return await this.http.post(this.urlAPI + ApiUrlConstants.API_FRIENDSINTRIP_URL ,formData).toPromise();            
        }
        catch (e) {
            console.log("ok");
        }
    }
    getPaymentTrip = async (id) => {
        try {
            const result = await this.http.get(this.urlAPI + ApiUrlConstants.API_PAYMENTHISTORY_URL + id).toPromise();
            return result;
        }
        catch (e) {
            console.log(e);
        }
    }
}