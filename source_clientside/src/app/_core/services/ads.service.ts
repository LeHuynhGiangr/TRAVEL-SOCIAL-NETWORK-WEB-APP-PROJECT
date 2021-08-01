import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiUrlConstants } from '../common/api-url.constants';
@Injectable({
    providedIn: 'root'
})
export class AdService {
    private urlAPI :string=ApiUrlConstants.API_URL;

    constructor(private http: HttpClient) {

    }
    createAd = async (ad) => {
        try {
            const result = await this.http.post(this.urlAPI + ApiUrlConstants.API_ADVERTISEMENT_URL,ad).toPromise();
            return result;
        }
        catch (e) {
            console.log(e);
        }
    }
}