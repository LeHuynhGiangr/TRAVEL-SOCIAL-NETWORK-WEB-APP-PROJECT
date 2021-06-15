import { Component, OnInit, ElementRef, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { DOCUMENT } from '@angular/common';
import { Discount } from 'src/app/_core/models/discount.model';
import { PageUrl } from 'src/app/_helpers/get-page-url';
import { DiscountService } from 'src/app/_core/services/discount.service';
@Component({
    selector: 'app-fanpage-discount',
    templateUrl: './fanpage-discount.component.html',
    styleUrls: ['./fanpage-discount.component.css'],   
})
export class FanpageDiscountComponent implements OnInit {
    dis_count:number
    discounts:any
    public discountList = new Array<Discount>();
    constructor(private m_router: Router, private elementRef: ElementRef,@Inject(DOCUMENT) private doc, private DService: DiscountService,
    public pageurl:PageUrl) {}
    
    async ngOnInit() {
        var script = document.createElement("script");
        script.type = "text/javascript";
        script.src = "../assets/js/script.js";
        this.elementRef.nativeElement.appendChild(script);
        this.getDiscountList()
    }
    getDiscountList = async () => {
        this.discounts = await this.DService.getListDiscountByPageId(this.pageurl.getPageIdStorage())
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
                    discount.Case = "all cases"
                if(discount.LimitCost == 0 && discount.LimitPassenger > 0)
                    discount.Case = " > " + discount.LimitPassenger + " people"
                if(discount.LimitCost > 0 && discount.LimitPassenger == 0)
                    discount.Case = " > " + discount.LimitCost + " $"
                if(discount.LimitCost > 0 && discount.LimitPassenger > 0)
                    discount.Case = " > " + discount.LimitPassenger + " people" + " and > " + discount.LimitCost + " $"
                discount.DateExpired = this.discounts[i].dateExpired
                discount.DateCreate = this.discounts[i].dateCreated
                discount.PageId = this.discounts[i].pageId
                this.discountList.push(discount)
            }
        }
    }
}