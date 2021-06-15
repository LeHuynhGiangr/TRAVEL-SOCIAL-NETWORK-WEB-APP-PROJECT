import { Component, OnInit, ElementRef, Inject } from '@angular/core';
import {ICreateOrderRequest, IPayPalConfig} from 'ngx-paypal';
import { Router } from '@angular/router';
import { DOCUMENT } from '@angular/common';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {STEPPER_GLOBAL_OPTIONS} from '@angular/cdk/stepper';
import { Trips } from '../../_core/models/trip.model';
import { TripStatic } from '../../_core/data-repository/trip';
import { TripService } from '../../_core/services/trip.service';
import {TripUrl} from 'src/app/_helpers/get-trip-url'
import { LoginService } from 'src/app/_core/services/login.service';
import { Discount } from 'src/app/_core/models/discount.model';
import { DiscountService } from 'src/app/_core/services/discount.service';
import { TimelineUrl } from 'src/app/_helpers/get-timeline-url';
@Component({
    selector: 'app-trip-payment',
    templateUrl: './trip-payment.component.html',
    styleUrls: ['./trip-payment.component.css'],
    providers: [{
        provide: STEPPER_GLOBAL_OPTIONS, useValue: {showError: true}
      }]
})
export class TripPaymentComponent implements OnInit {
    public payPalConfig ?: IPayPalConfig;
    firstFormGroup: FormGroup;
    secondFormGroup: FormGroup;
    thirdFormGroup: FormGroup;
    check:boolean
    public trips :Trips;
    cost:number
    total:number
    people:number=1
    name:string
    address:string
    email:string
    phone:string
    requirements:string
    dis_count:number
    discounts:any
    code:string
    percent:number
    public discountList = new Array<Discount>();
    constructor(private router: Router, private elementRef: ElementRef,@Inject(DOCUMENT) private doc,private _formBuilder: FormBuilder,
    private TService:TripService, public tripurl:TripUrl,private service: LoginService, private DService: DiscountService, private timelineurl:TimelineUrl ) {}

    ngOnInit() {
      var script = document.createElement("script");
      script.type = "text/javascript";
      script.src = "../assets/js/script.js";
      this.elementRef.nativeElement.appendChild(script);
      this.initConfig();
      this.getDiscountList()
      this.code = "Code Discount"
      this.trips = new Trips()
      this.trips.Id = TripStatic.Id
      this.trips.Name = TripStatic.Name
      this.trips.Description = TripStatic.Description
      const x = Number(TripStatic.Cost)
      this.trips.Cost = TripStatic.Cost
      this.cost = parseInt(this.trips.Cost)/10
      this.total = (this.cost + parseInt(this.trips.Cost))*this.people
      this.trips.Start = TripStatic.Departure
      this.trips.Destination = TripStatic.Destination
      this.trips.Policy = TripStatic.Policy
      this.trips.InfoContact = TripStatic.InfoContact
      this.trips.Persons = TripStatic.Persons
      this.trips.DateStart = TripStatic.DateStart
      this.trips.DateEnd = TripStatic.DateEnd
      this.trips.Service = TripStatic.Service
      this.check=false
      this.firstFormGroup = this._formBuilder.group({
        firstCtrl: ['', Validators.required]
      });
      this.secondFormGroup = this._formBuilder.group({
        secondCtrl: ['', Validators.required]
      });
    }
    successfully(){
        this.check=true
    }
    valuechange(newValue) {
      this.code = "Code Discount"
      this.percent = 0
      this.total = parseFloat(((this.cost + parseInt(this.trips.Cost))*newValue).toFixed(2));
    }
    private initConfig(): void {
        this.payPalConfig = {
          currency: 'USD',
          clientId: 'AdwX6ZgL8Z2IgAJeIZkfrKqKQNNA64tkKCyoE2ClKcO9S1EpHyaLxBdcDqQAaY92eCK69DwGSL47_j_0', // add paypal clientId here
          createOrderOnClient: (data) => <ICreateOrderRequest> {
            intent: 'CAPTURE',
            purchase_units: [{
              amount: {
                currency_code: 'USD',
                value: this.total.toString(),
                breakdown: {
                  item_total: {
                    currency_code: 'USD',
                    value: this.total.toString()
                  }
                }
              },
              items: [{
                name: this.trips.Name,
                quantity: this.people.toString(),
                category: 'DIGITAL_GOODS',
                unit_amount: {
                  currency_code: 'USD',
                  value: (this.cost + parseInt(this.trips.Cost)).toString(),
                },
              }]
            }]
          },
          advanced: {
            commit: 'true'
          },
          style: {
            label: 'paypal',
            layout: 'vertical',
            size: 'small',
            color: 'blue',
            shape: 'rect'
          },
          onApprove: (data, actions) => {
            console.log('onApprove - transaction was approved, but not authorized', data, actions);
            actions.order.get().then(details => {
              console.log('onApprove - you can get full order details inside onApprove: ', details);
            });
    
          },
          onClientAuthorization: async (data) => {
            console.log('onClientAuthorization - you should probably inform your server about completed transaction at this point', data);
            if(data["status"]=="COMPLETED")
              {
                try{
                  const formData = new FormData();
                  formData.append('name', this.name);
                  formData.append('address',this.address)
                  formData.append('email',this.email)
                  formData.append('phoneNumber',this.phone)
                  formData.append('requirements',this.requirements)
                  formData.append('peopleNumber',this.people.toString())
                  formData.append('costPayment',this.total.toString())
                  formData.append('userId',this.service.getUserIdStorage())
                  formData.append('tripId',TripStatic.Id)
                  await this.TService.addUserInTrip(formData);
                  alert("Payment succesfully !")
                  this.check=true
                }
                catch(e)
                {
                  alert("Payment failure !")
                }
              }
          },
          onCancel: (data, actions) => {
            console.log('OnCancel', data, actions);
    
          },
          onError: err => {
            console.log('OnError', err);
          },
          onClick: (data, actions) => {
            console.log('onClick', data, actions);
          }
        };
      }
      getDiscountList = async () => {
        this.discounts = await this.DService.getListDiscountByPageId(TripStatic.PageId)
        this.dis_count = this.discounts.length
        for (let i = 0; i < this.discounts.length; i++) {
          if(this.discounts[i].active == true)
          {
            let discount = new Discount();
            discount.Id = this.discounts[i].id.toString()
            discount.Name = this.discounts[i].name
            discount.CodeDiscount = this.discounts[i].codeDiscount
            discount.Active = this.discounts[i].active
            discount.DiscountPer = this.discounts[i].discountPer
            discount.LimitCost = this.discounts[i].limitCost
            discount.LimitPassenger = this.discounts[i].limitPassenger
            if(discount.LimitCost == 0 && discount.LimitPassenger == 0)
                discount.Case = discount.DiscountPer + "% discount for all cases"
            if(discount.LimitCost == 0 && discount.LimitPassenger > 0)
                discount.Case = discount.DiscountPer + "% discount when more than " + discount.LimitPassenger + " people"
            if(discount.LimitCost > 0 && discount.LimitPassenger == 0)
                discount.Case = discount.DiscountPer + "% discount when the price is more than " + discount.LimitCost + " $"
            if(discount.LimitCost > 0 && discount.LimitPassenger > 0)
                discount.Case = discount.DiscountPer + "% discount when more than " + discount.LimitPassenger + " people and " + discount.LimitCost + " $"
            discount.DateExpired = this.discounts[i].dateExpired
            discount.DateCreate = this.discounts[i].dateCreated
            discount.PageId = this.discounts[i].pageId
            this.discountList.push(discount)
          }
        }
    }
    letDiscount(lcost,lpas,code,lper)
    {
      console.log(lpas)
      console.log(lcost)
      if(Number(this.people) < Number(lpas) || Number(this.cost) < Number(lcost))
        this.timelineurl.showError("Not eligible for use !")
      else
      {
        this.code =  code
        this.percent = Number(lper)
        this.timelineurl.showSuccess("Discount code applied successfully!")
        this.total = parseFloat(((this.cost + parseInt(this.trips.Cost))*this.people).toFixed(2)) - parseFloat(((this.cost + parseInt(this.trips.Cost))*this.people*this.percent/100).toFixed(2));
      }
    }
}
