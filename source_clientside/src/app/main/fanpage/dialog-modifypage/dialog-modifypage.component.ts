import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Pages } from 'src/app/_core/models/pages.model';
import { PagesService } from 'src/app/_core/services/page.service';
import { PageUrl } from 'src/app/_helpers/get-page-url';
import { TimelineUrl } from 'src/app/_helpers/get-timeline-url';
import { PrimeNGConfig } from 'primeng/api';
@Component({
    selector: 'app-dialog-modifypage',
    templateUrl: './dialog-modifypage.component.html',
    styleUrls: ['./dialog-modifypage.component.css']
  })
  export class DialogModifyPageComponent implements OnInit {
    public pages: Pages;
    constructor(public dialogRef: MatDialogRef<DialogModifyPageComponent>, @Inject(MAT_DIALOG_DATA) public data: any,
    public pageurl:PageUrl, public PService:PagesService,private timelineurl:TimelineUrl, private primengConfig: PrimeNGConfig){}
    async ngOnInit() {
        this.getPage()
    }
    async getPage(){
        this.primengConfig.ripple = true;
        this.pages = new Pages()
        this.pages.Name = this.pageurl.getPageNameStorage()
        this.pages.Address = this.pageurl.getPageAddressStorage()
        this.pages.PhoneNumber = this.pageurl.getPagePhoneNumberStorage()
        this.pages.Description = this.pageurl.getPageDescriptionStorage()
    }
    onNoClick(): void {
        this.dialogRef.close();
    }
    async onSave()
    {
        if(this.pages.Name == "" || this.pages.Address == "" || this.pages.PhoneNumber == "" || this.pages.Description == "")
        {
            this.timelineurl.showError("Please enter full information !")
        }
        else
        {
            const page = await this.PService.modifyPage(this.pageurl.getPageIdStorage(),this.pages)
            this.timelineurl.showSuccess("Modify page successfully !")
            setTimeout(() => {
                this.dialogRef.close();
            }, 1000)
        }
    }
  }