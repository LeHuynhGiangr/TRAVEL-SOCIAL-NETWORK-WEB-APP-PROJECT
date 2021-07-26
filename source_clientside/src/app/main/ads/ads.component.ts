import { Component, OnInit, ElementRef, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { DOCUMENT } from '@angular/common';
import {ICreateOrderRequest, IPayPalConfig} from 'ngx-paypal';
import {STEPPER_GLOBAL_OPTIONS} from '@angular/cdk/stepper';
import { Pages } from 'src/app/_core/models/pages.model';
import { PagesService } from 'src/app/_core/services/page.service';
@Component({
    selector: 'app-ads',
    templateUrl: './ads.component.html',
    styleUrls: ['./ads.component.css'],
    providers: [{
      provide: STEPPER_GLOBAL_OPTIONS, useValue: {showError: true}
    }]
})

export class AdsComponent implements OnInit {
  public payPalConfig ?: IPayPalConfig;
  public pages:any
  public pageList = new Array<Pages>();
  formatLabel(value: number) {
      return Math.round(value) + '%';
  }
    constructor(private router: Router, private elementRef: ElementRef,@Inject(DOCUMENT) private doc,private PService:PagesService ) {}

    ngOnInit() {
      var script = document.createElement("script");
      script.type = "text/javascript";
      script.src = "../assets/js/script.js";
      this.elementRef.nativeElement.appendChild(script);
      this.initConfig();
      this.getMyListPages();
    }
    async getMyListPages(){
      this.pages = await this.PService.getAllPages();
        for (let i = 0; i < this.pages.length; i++) {
            let page = new Pages();
            page.Id = this.pages[i].id.toString();
            page.Name = this.pages[i].name
            this.pageList.push(page);
        }
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
              value: "20",
              breakdown: {
                item_total: {
                  currency_code: 'USD',
                  value: "20"
                }
              }
            },
            items: [{
              name: "test",
              quantity: "2",
              category: 'DIGITAL_GOODS',
              unit_amount: {
                currency_code: 'USD',
                value: "10",
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
