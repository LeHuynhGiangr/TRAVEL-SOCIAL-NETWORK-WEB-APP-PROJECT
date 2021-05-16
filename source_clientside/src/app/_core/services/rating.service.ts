import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiUrlConstants } from '../common/api-url.constants';
@Injectable({
    providedIn: 'root'
})
export class RatingService {
    private urlAPI :string=ApiUrlConstants.API_URL;

    constructor(private http: HttpClient) {

    }
    getAllRatings = async () => {
        try {   
            const result = await this.http.get(this.urlAPI + ApiUrlConstants.API_RATING_LOAD).toPromise();
            return result;
        }
        catch (e) {
            console.log(e);
        }
    }
}