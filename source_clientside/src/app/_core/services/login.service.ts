import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { ApiUrlConstants } from 'src/app/_core/common/api-url.constants';
import { SystemConstants } from 'src/app/_core/common/system.constants';
import { UserProfile } from 'src/app/_core/data-repository/profile';

@Injectable({
    providedIn: 'root'
})
export class LoginService {
    //private urlAPI = 'https://localhost:44350/';
    private urlAPI = ApiUrlConstants.API_URL;
    private currentUser: BehaviorSubject<any>

    constructor(private http: HttpClient) {
        this.currentUser = new BehaviorSubject<any>(null);
    }

    getCurrrentUser(): any {
        return this.currentUser.value;
    }

    getUserById = async (id) => {
        try {
            const config = {
                headers: {
                    Authorization: this.getConfigToken()
                }
            }
            const result = await this.http.get(this.urlAPI + ApiUrlConstants.API_LOAD_USERBYID_URL + id).toPromise();
            return result
        }
        catch (e) {
            console.log(e);
        }
    }

    getUser = async () => {
        try {
            const result = await this.http.get(this.urlAPI + ApiUrlConstants.API_LOAD_MAINUSER_URL).toPromise();
            this.currentUser.next(result);
            UserProfile.Id = this.getUserIdStorage();
            UserProfile.FirstName = this.getFirstNameStorage()
            return result;
        }
        catch (e) {
            console.log(e);
            // this.removeToken();
        }
    }

    sendOtp = async (email) => {
        try {

            console.log("test email: ", email)

            const formData = new FormData();
            formData.append('email', email);

            return await this.http.post(this.urlAPI + ApiUrlConstants.API_SEND_OTP_URL, formData).toPromise();

        }
        catch (e) {
            alert("Send mail successfully");
        }
    }

    postUser = async (users) => {
        try {
            console.log(users);
            return await this.http.post(this.urlAPI + ApiUrlConstants.API_REGISTER_URL, users).toPromise();

        }
        catch (e) {
            alert("Username are already registered or OTP wrong !");
        }
    }

    login = async (username, password) => {
        try {
            const data = {
                username,
                password
            };

            const res = await this.http.post(this.urlAPI + ApiUrlConstants.API_LOGIN_URL, data, { withCredentials: true }).toPromise() as any;
            if (res["active"] == true) {
                alert("Login successfully")
                this.setToken(res.jwtToken);
                this.saveUserStorage(res["id"],res["firstName"]);
                await this.getUser();
            }
            else {
                alert("Account is blocked")
            }
            return res;
        }
        catch (e) {
            console.log(e);
        }
    };

    logout = () => {
        this.removeToken();
        localStorage.clear();
        this.currentUser.next(null);
    }

    saveUserStorage = (userId: string,firstName:string) => {
        localStorage.setItem('userId', userId)
        localStorage.setItem('firstName',firstName)
    }

    getUserIdStorage = () => {
        return localStorage.getItem('userId').toString();
    }
    getFirstNameStorage = () => {
        return localStorage.getItem('firstName').toString();
    }

    setToken = (token) => {
        localStorage.setItem(SystemConstants.LOCAL_STORED_JWT_Key, token);
    };

    removeToken = () => {
        localStorage.removeItem(SystemConstants.LOCAL_STORED_JWT_Key);
    }

    getToken = () => {
        return localStorage.getItem(SystemConstants.LOCAL_STORED_JWT_Key);
    };
    
    getConfigToken = () => {
        const token = this.getToken();
        return token ? 'Bearer ' + token : undefined;
    }
}