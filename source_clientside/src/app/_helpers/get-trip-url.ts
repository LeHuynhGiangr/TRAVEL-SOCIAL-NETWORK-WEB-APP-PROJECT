import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TripStatic } from './../_core/data-repository/trip';
import { TripService } from './../_core/services/trip.service';
@Injectable({
    providedIn:'root'
})
export class TripUrl{
    public m_returnUrl: string;
    constructor(private m_route: ActivatedRoute, private m_router: Router,private TService:TripService){}
    public async getNavigation( id) {
        this.m_returnUrl = this.m_route.snapshot.queryParams['returnUrl'] || '/main/trip-detail/'+id;
        console.log(this.m_returnUrl)
        TripStatic.Id = id
        const result = await this.TService.getTripDetail(TripStatic.Id);
        TripStatic.Name = result["name"]
        TripStatic.Image = result["image"]
        TripStatic.Description =result["description"]
        TripStatic.Cost =result["cost"]
        TripStatic.Departure = result["start"]
        TripStatic.Destination = result["destination"]
        TripStatic.Policy = result["policy"]
        TripStatic.InfoContact = result["infoContact"]
        TripStatic.Service = result["service"]
        TripStatic.Persons = result["persons"]
        TripStatic.DateStart = result["dateStart"]
        TripStatic.DateEnd = result["dateEnd"]
        TripStatic.PageId = result["pageId"]
        this.m_router.navigateByUrl(this.m_returnUrl, {skipLocationChange:true});
    }
    public async getNavigationPayment( id) {
        this.m_returnUrl = this.m_route.snapshot.queryParams['returnUrl'] || '/main/trip-payment/'+id;
        console.log(this.m_returnUrl)
        TripStatic.Id = id
        const result = await this.TService.getTripDetail(TripStatic.Id);
        TripStatic.Name = result["name"]
        TripStatic.Image = result["image"]
        TripStatic.Description =result["description"]
        TripStatic.Cost =result["cost"]
        TripStatic.Departure = result["start"]
        TripStatic.Destination = result["destination"]
        TripStatic.Policy = result["policy"]
        TripStatic.InfoContact = result["infoContact"]
        TripStatic.Service = result["service"]
        TripStatic.Persons = result["persons"]
        TripStatic.DateStart = result["dateStart"]
        TripStatic.DateEnd = result["dateEnd"]
        this.m_router.navigateByUrl(this.m_returnUrl, {skipLocationChange:true});
    }
}