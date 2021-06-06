import { Component, OnInit, ElementRef, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { AppUsers } from '../../../login/shared/login.model';
import { TripService } from '../../../_core/services/trip.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DatePipe } from '@angular/common'
import { PageUrl } from 'src/app/_helpers/get-page-url';
import { TimelineUrl } from 'src/app/_helpers/get-timeline-url';
import { PrimeNGConfig } from 'primeng/api';
@Component({
    selector: 'app-trip-dialog',
    templateUrl: './trip-dialog.component.html',
    styleUrls: ['./trip-dialog.component.css'],
    providers: [DatePipe]
  })
export class TripDialogComponent implements OnInit {
  public appUsers: AppUsers;
  public Image: File
  public Name : string=""
  public Description : string=""
  public Departure : string=""
  public Destination: string=""
  public Service: string=""
  public Policy: string=""
  public InfoContact: string=""
  public DateStart: Date=null
  public DateEnd: Date=null
  public PageId: string=""
  public Content : string=""
  public Cost : string=""
  public Persons : string=""
  public m_returnUrl: string;
  url;
  constructor(public dialogRef: MatDialogRef<TripDialogComponent>, private elementRef: ElementRef, @Inject(DOCUMENT) private doc,
    private service: TripService,public datepipe: DatePipe, public pageurl:PageUrl,private timelineurl:TimelineUrl, private primengConfig: PrimeNGConfig) {
  }
  async ngOnInit() {
    this.primengConfig.ripple = true;
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
      formData.append('persons',this.Persons)
      formData.append('service',this.Service)
      if(this.DateStart!=null && this.DateEnd !=null)
      {
        let start_date =this.datepipe.transform(this.DateStart, 'yyyy-MM-dd');
        let end_date =this.datepipe.transform(this.DateEnd, 'yyyy-MM-dd');
        formData.append('dateStart',start_date.toString())
        formData.append('dateEnd',end_date.toString())
      }
      formData.append('pageId',this.pageurl.getPageIdStorage())
      if(this.Image == null || this.Description == "" || this.Name =="" || this.Departure =="" || this.Content ==""
      || this.Destination == "" || this.Policy == "" || this.InfoContact == "" || this.Cost == "" || this.Persons ==""
      || this.Service =="" || this.DateStart ==null || this.DateEnd == null)
      {
        this.timelineurl.showError("Please enter full information !")
      }         
      else
      {
        await this.service.createTrip(formData);
        this.timelineurl.showSuccess("Create a trip successfully !")
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