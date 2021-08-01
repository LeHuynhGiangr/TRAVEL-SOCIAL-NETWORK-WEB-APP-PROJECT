import { Component, OnInit, ElementRef, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { DOCUMENT } from '@angular/common';
import {ICreateOrderRequest, IPayPalConfig} from 'ngx-paypal';
import {STEPPER_GLOBAL_OPTIONS} from '@angular/cdk/stepper';
import { Pages } from 'src/app/_core/models/pages.model';
import { PagesService } from 'src/app/_core/services/page.service';
import { AdService } from 'src/app/_core/services/ads.service';
import { Ad } from 'src/app/_core/models/ad.model';
import { MatSliderChange } from '@angular/material/slider';
import { FriendService } from 'src/app/_core/services/friends.service';
import { DatePipe } from '@angular/common'
@Component({
    selector: 'app-ads',
    templateUrl: './ads.component.html',
    styleUrls: ['./ads.component.css'],
    providers: [{
      provide: STEPPER_GLOBAL_OPTIONS, useValue: {showError: true}
    },DatePipe]
})

export class AdsComponent implements OnInit {
  public payPalConfig ?: IPayPalConfig;
  public pages:any
  public pageList = new Array<Pages>();
  public ad: Ad;
  user:any
  days:Number
  total:Number
  usercountfrom:string
  usercountto:string
  date:Date
  formatLabel(value: number) {
      return Math.round(value) + '%';
  }
    constructor(private router: Router, private elementRef: ElementRef,@Inject(DOCUMENT) private doc,private PService:PagesService,
    private AService:AdService,private FService:FriendService,public datepipe: DatePipe ) {}

    ngOnInit() {
      var script = document.createElement("script");
      script.type = "text/javascript";
      script.src = "../assets/js/script.js";
      this.elementRef.nativeElement.appendChild(script);
      this.initConfig();
      this.getMyListPages();
      this.usercountfrom = "0"
      this.usercountto = "0"
      this.ad = new Ad()
      this.ad.Name = ""
      this.ad.Priority = 0
      this.ad.Cost = "0"
      this.ad.EndDate = ""
      this.ad.PageId = ""
      this.days = 0
    }
    async getMyListPages(){
      this.pages = await this.PService.getAllPages();
        for (let i = 0; i < this.pages.length; i++) {
            let page = new Pages();
            page.Id = this.pages[i].id.toString();
            page.Name = this.pages[i].name
            this.pageList.push(page);
        }
      this.user = await this.FService.getAllFriends();
    }
    changePage(value)
    {
      this.ad.PageId = value
    }
    onInputChange(event: MatSliderChange) {
      this.usercountfrom = ((this.user.length-1)*event.value/100 - (this.user.length-1)*event.value/1000).toFixed(2)
      this.usercountto = ((this.user.length-1)*event.value/100).toFixed(2)
      this.ad.Cost = (event.value *10).toString()
      this.total = Number(this.ad.Cost) * Number(this.days)
      this.ad.Priority = event.value
    }
    dayChange(value:number): void {  
      var datenow = new Date()
      let dates = datenow.setDate(datenow.getDate()+Number(value))
      this.date = new Date(dates)
      this.ad.EndDate = this.date.toString()
      this.days = value
      this.total = Number(this.ad.Cost) * Number(this.days)
    }
    keyPress(event: any) {
      const pattern = /[0-9]/;
  
      let inputChar = String.fromCharCode(event.charCode);
      if (event.keyCode != 8 && !pattern.test(inputChar)) {
        event.preventDefault();
      }
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
                  value: this.total.toString(),
                }
              }
            },
            items: [{
              name: this.ad.Name,
              quantity: "1",
              category: 'DIGITAL_GOODS',
              unit_amount: {
                currency_code: 'USD',
                value: this.total.toString(),
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
                this.ad.EndDate = this.datepipe.transform(this.ad.EndDate, 'yyyy-MM-dd');
                console.log(this.ad)
                await this.AService.createAd(this.ad)
                let page = new Pages()
                page.Priority = this.ad.Priority
                page.Id = this.ad.PageId
                await this.PService.priorityPage(page)
                alert("Payment sucessfully !")
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
