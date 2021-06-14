import { Component, OnInit, ElementRef, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { DatePipe, DOCUMENT } from '@angular/common';
import { MatDialogRef } from '@angular/material/dialog';
import { Discount } from '../../../_core/models/discount.model'
import { DiscountService } from '../../../_core/services/discount.service'
import { PageUrl } from 'src/app/_helpers/get-page-url';
import { TimelineUrl } from 'src/app/_helpers/get-timeline-url';
@Component({
    selector: 'app-dialog-discount',
    templateUrl: './dialog-discount.component.html',
    styleUrls: ['./dialog-discount.component.css'],   
    providers: [DatePipe]
})
export class DialogDiscountComponent implements OnInit {
    public discounts: Discount;
    constructor(public dialogRef: MatDialogRef<DialogDiscountComponent>, private m_router: Router, 
        private elementRef: ElementRef,@Inject(DOCUMENT) private doc, private DService: DiscountService,
        public pageurl:PageUrl,public datepipe: DatePipe,private timelineurl:TimelineUrl) {}
    async ngOnInit() {
      var script = document.createElement("script");
      script.type = "text/javascript";
      script.src = "../assets/js/script.js";
      this.elementRef.nativeElement.appendChild(script);

      this.discounts = new Discount()
      this.discounts.CodeDiscount = ""
      this.discounts.DiscountPer = 0
      this.discounts.LimitCost = 0
      this.discounts.LimitPassenger = 0
      this.discounts.DateExpired = ""
      this.discounts.Name = ""
      this.discounts.PageId = this.pageurl.getPageIdStorage()
      this.discounts.Active = true
    }
    onNoClick(): void {
        this.dialogRef.close();
    }
    onSave()
    {
        try{
            if(this.discounts.CodeDiscount == "" || this.discounts.DiscountPer == null || this.discounts.LimitCost == null
            || this.discounts.LimitPassenger == null || this.discounts.DateExpired == ""|| this.discounts.Name == "")
            {
              this.timelineurl.showError("Please enter full information !")
            }         
            else
            {
              let start_date =this.datepipe.transform(this.discounts.DateExpired, 'yyyy-MM-dd');
              this.discounts.DateExpired = start_date
              this.DService.createDiscount(this.discounts)
              this.timelineurl.showSuccess("Create a discount code successfully !")
              setTimeout(() => {
                this.dialogRef.close();
              }, 2000)
            }
        }
        catch(e)
        {
        this.timelineurl.showError(e)
            setTimeout(() => {
            this.dialogRef.close();
            }, 1000)
        }
    }
}