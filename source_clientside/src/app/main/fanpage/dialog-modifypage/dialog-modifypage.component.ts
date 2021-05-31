import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Pages } from 'src/app/_core/models/pages.model';
import { PagesService } from 'src/app/_core/services/page.service';
import { PageUrl } from 'src/app/_helpers/get-page-url';
@Component({
    selector: 'app-dialog-modifypage',
    templateUrl: './dialog-modifypage.component.html',
    styleUrls: ['./dialog-modifypage.component.css']
  })
  export class DialogModifyPageComponent implements OnInit {
    public pages: Pages;
    constructor(public dialogRef: MatDialogRef<DialogModifyPageComponent>, @Inject(MAT_DIALOG_DATA) public data: any,
    public pageurl:PageUrl, public PService:PagesService){}
    async ngOnInit() {
        this.getPage()
    }
    async getPage(){
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
        const page = await this.PService.modifyPage(this.pageurl.getPageIdStorage(),this.pages)
        alert("Update successfully !")
        this.dialogRef.close();
    }
  }