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
    getAllRatings = async (id) => {
        try {   
            const result = await this.http.get(this.urlAPI + ApiUrlConstants.API_RATING_LOAD+id).toPromise();
            return result;
        }
        catch (e) {
            console.log(e);
        }
    }
    postRating = async (rating) => {
        try {
            const result = await this.http.post(this.urlAPI + ApiUrlConstants.API_RATING_LOAD,rating).toPromise();
            return result;
        }
        catch (e) {
            console.log(e);
        }
    }
    blockRating = async (id) => {
        try {
            const result = await this.http.put(this.urlAPI + ApiUrlConstants.API_RATING_BLOCK+id,null).toPromise();
            return result;
        }
        catch (e) {
            console.log(e);
        }
    }
}