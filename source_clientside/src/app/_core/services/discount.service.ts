import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiUrlConstants } from '../common/api-url.constants';
@Injectable({
    providedIn: 'root'
})
export class DiscountService {
    private urlAPI :string=ApiUrlConstants.API_URL;

    constructor(private http: HttpClient) {
        
    }
    getListDiscountByPageId = async (id) => {
        try {
            return await this.http.get(this.urlAPI + ApiUrlConstants.API_DISCOUNT_URL+ id).toPromise();            
        }
        catch (e) {
            console.log("ok");
        }
    }
    createDiscount = async (dis) => {
        try {
            return await this.http.post(this.urlAPI + ApiUrlConstants.API_DISCOUNT_URL, dis).toPromise();            
        }
        catch (e) {
            console.log("ok");
        }
    }
}