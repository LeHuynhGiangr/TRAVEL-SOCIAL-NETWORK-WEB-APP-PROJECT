import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiUrlConstants } from '../common/api-url.constants';
@Injectable({
    providedIn: 'root'
})
export class MessagesService2 {
    private urlAPI :string=ApiUrlConstants.API_URL;
    constructor(private http: HttpClient) {

    }
    getMessagesUser = async (idclient) => {
        try {
       
            const result = await this.http.get(this.urlAPI + ApiUrlConstants.API_MESSAGES_URL+idclient).toPromise();
            return result;
        }
        catch (e) {
            console.log(e);
        }
    }
    sendMessages = async (formData) => {
        try {
            return await this.http.post(this.urlAPI + ApiUrlConstants.API_MESSAGES_URL ,formData).toPromise();            
        }
        catch (e) {
            console.log("ok");
        }
    }

}