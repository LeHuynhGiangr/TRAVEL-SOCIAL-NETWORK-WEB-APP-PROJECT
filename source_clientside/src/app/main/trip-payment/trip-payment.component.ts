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
    constructor(private router: Router, private elementRef: ElementRef,@Inject(DOCUMENT) private doc,private _formBuilder: FormBuilder,
    private TService:TripService, public tripurl:TripUrl,private service: LoginService ) {}

    ngOnInit() {
      var script = document.createElement("script");
      script.type = "text/javascript";
      script.src = "../assets/js/script.js";
      this.elementRef.nativeElement.appendChild(script);
      this.initConfig();
      this.trips = new Trips()
      this.trips.Id = TripStatic.Id
      this.trips.Name = TripStatic.Name
      this.trips.Description = TripStatic.Description
      this.trips.Cost = TripStatic.Cost
      this.cost = parseInt(this.trips.Cost)/10
      this.total = (this.cost + parseInt(this.trips.Cost))*this.people
      this.trips.Departure = TripStatic.Departure
      this.trips.Destination = TripStatic.Destination
      this.trips.Policy = TripStatic.Policy
      this.trips.InfoContact = TripStatic.InfoContact
      this.trips.Days = TripStatic.Days
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
        this.total = (this.cost + parseInt(this.trips.Cost))*newValue
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
}
