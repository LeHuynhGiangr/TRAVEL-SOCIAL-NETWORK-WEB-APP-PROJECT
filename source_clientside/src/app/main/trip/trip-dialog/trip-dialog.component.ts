import { Component, OnInit, ElementRef, Inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DOCUMENT } from '@angular/common';
import { AppUsers } from '../../../login/shared/login.model';
import { TripService } from '../../../_core/services/trip.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PageStatic } from 'src/app/_core/data-repository/page';
import { DatePipe } from '@angular/common'
import { PageUrl } from 'src/app/_helpers/get-page-url';
@Component({
    selector: 'app-trip-dialog',
    templateUrl: './trip-dialog.component.html',
    styleUrls: ['./trip-dialog.component.css'],
    providers: [DatePipe]
  })
  export class TripDialogComponent implements OnInit {
    public appUsers: AppUsers;
    public Image: File
    public Name : string
    public Description : string
    public Departure : string
    public Destination: string
    public Service: string
    public Policy: string
    public InfoContact: string
    public DateStart: Date
    public DateEnd: Date
    public PageId: string
    public Content : string
    public Cost : string
    public Days : string
    public m_returnUrl: string;
    url;
    constructor(public dialogRef: MatDialogRef<TripDialogComponent>, private elementRef: ElementRef, @Inject(DOCUMENT) private doc,
      private service: TripService,private m_route: ActivatedRoute,private m_router: Router,public datepipe: DatePipe, public pageurl:PageUrl) {
    }
    async ngOnInit() {
    }
    onNoClick(): void {
        this.dialogRef.close();
      }
     //display image before upload
  onSelectFile(event) {
    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();

      reader.readAsDataURL(event.target.files[0]); // read file as data url

      reader.onload = (event) => { // called once readAsDataURL is completed
        this.url = event.target.result;
      }

      // Saved Image into varible
      this.Image = event.target.files[0];
    }
  }
  async onSave() {
    try{
      const formData = new FormData();
      if (Image) {
        formData.append('image', this.Image);
        formData.append('description',this.Description)
        formData.append('name',this.Name)
        formData.append('location',"1")
        formData.append('start',this.Departure)
        formData.append('content',this.Content)
        formData.append('destination',this.Destination)
        formData.append('policy',this.Policy)
        formData.append('infoContact',this.InfoContact)
        formData.append('cost',this.Cost)
        formData.append('days',this.Days)
        formData.append('service',this.Service)
        let start_date =this.datepipe.transform(this.DateStart, 'dd/MM/yyyy');
        let end_date =this.datepipe.transform(this.DateEnd, 'dd/MM/yyyy');
        formData.append('dateStart',start_date.toString())
        formData.append('dateEnd',end_date.toString())
        formData.append('pageId',this.pageurl.getPageIdStorage())
        await this.service.createTrip(formData);
        alert("Create succesfully !")
        this.dialogRef.close();
        this.refresh()
      }
      else
      {
        alert("Create failure !")
      }
    }
    catch(e)
    {
      alert("Upload failure !")
    }
  }
  refresh(): void {
    this.m_returnUrl = this.m_route.snapshot.queryParams['returnUrl'] || '/main/trip';
    this.m_router.navigateByUrl(this.m_returnUrl, {skipLocationChange:true});
    
    //window.location.reload();
  }
}