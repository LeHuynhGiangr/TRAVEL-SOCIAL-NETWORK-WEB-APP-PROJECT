import { Component, OnInit, ElementRef, Inject } from '@angular/core';
import { DatePipe, DOCUMENT } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AdminService } from '../../admin/admin.service';
import { PagesService } from 'src/app/_core/services/page.service';
import { Pages } from 'src/app/_core/models/pages.model';
import { ApiUrlConstants } from 'src/app/_core/common/api-url.constants';
import { ConfirmationService, MessageService, ConfirmEventType } from 'primeng/api';
@Component({
    selector: 'app-dialog-pagerequest',
    templateUrl: './dialog-pagerequest.component.html',
    styleUrls: ['./dialog-pagerequest.component.css'],
    providers: [DatePipe]
  })
  export class DialogPageRequestComponent implements OnInit {
    public idPage;
    public pages: Pages;
    datePage:string
    fimage:string
    bimage:string
    constructor(public dialogRef: MatDialogRef<DialogPageRequestComponent>,
    private elementRef: ElementRef, @Inject(DOCUMENT) private doc,
    private Aservice: AdminService, private Pservice: PagesService,public datepipe: DatePipe
    ,private confirmationService: ConfirmationService,
    private messageService: MessageService) {
    }
    async ngOnInit() {
        const page = await this.Pservice.getPageById(this.idPage)
        this.pages = new Pages();
        this.pages.Name = page["name"]
        this.pages.Address = page["address"]
        this.pages.Description = page["description"]
        this.pages.PhoneNumber = page["phoneNumber"]
        this.pages.CreatedDate = page["dateCreated"]
        this.fimage = ApiUrlConstants.API_URL+"/"+page["fImageCard"]
        this.bimage = ApiUrlConstants.API_URL+"/"+page["bImageCard"]
        this.datePage = this.datepipe.transform(this.pages.CreatedDate, 'yyyy-MM-dd');
    }
    onNoClick(): void {
        this.dialogRef.close();
    }
    async accept() {
        await this.Aservice.acceptPage(this.idPage)
    }
    async acceptPage() {
    this.confirmationService.confirm({
        message: 'Do you want to accept page ?',
        header: 'Confirmation',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
        this.accept()
        this.messageService.add({ severity: 'success', summary: 'Confirmed', detail: 'Request approved successfully' });
        setTimeout(() => {
            this.dialogRef.close();
            }, 1500)
        },
        reject: (type) => {
        switch (type) {
            case ConfirmEventType.REJECT:
            this.messageService.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected' });
            break;
            case ConfirmEventType.CANCEL:
            this.messageService.add({ severity: 'warn', summary: 'Cancelled', detail: 'You have cancelled' });
            break;
        }
        }
    });
    }
}