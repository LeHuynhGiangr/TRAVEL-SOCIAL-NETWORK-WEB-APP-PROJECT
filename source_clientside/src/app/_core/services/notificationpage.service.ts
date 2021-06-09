import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ApiUrlConstants } from '../common/api-url.constants';

@Injectable({
  providedIn: 'root'
})
export class NotificationPageService {
  private urlAPI :string=ApiUrlConstants.API_URL;
  constructor(private http: HttpClient) { }
  getAllNotifications = async (id) => {
    try {
        const result = await this.http.get(this.urlAPI + ApiUrlConstants.API_NOTIFICATION_PAGE +id).toPromise();
        return result;
    }
    catch (e) {
        console.log(e);
        // this.removeToken();
    }
  }
  getNewNotifications = async (id) => {
    try {
        const result = await this.http.get(this.urlAPI + ApiUrlConstants.API_NOTIFICATION_PAGENEW +id).toPromise();
        return result;
    }
    catch (e) {
        console.log(e);
        // this.removeToken();
    }
  }
  createNotifications = async (page) => {
    try {
        const result = await this.http.post(this.urlAPI + ApiUrlConstants.API_NOTIFICATION_PAGE,page).toPromise();
        return result;
    }
    catch (e) {
        console.log(e);
        // this.removeToken();
    }
  }
}
