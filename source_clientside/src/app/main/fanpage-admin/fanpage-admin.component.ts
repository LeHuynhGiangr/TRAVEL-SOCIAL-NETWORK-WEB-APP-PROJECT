import { Component, OnInit, ElementRef, Inject,ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DOCUMENT } from '@angular/common';
import { AppUsers } from './../../login/shared/login.model';
import { PageUrl } from 'src/app/_helpers/get-page-url';
import { MatDialog } from '@angular/material/dialog';
import { TripDialogComponent } from '../trip/trip-dialog/trip-dialog.component';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import { TripService } from 'src/app/_core/services/trip.service';
import { PagesService } from 'src/app/_core/services/page.service';
import { Trips } from 'src/app/_core/models/trip.model';
import { ApiUrlConstants } from 'src/app/_core/common/api-url.constants';
import { DialogModifyTripComponent } from '../fanpage/dialog-modifytrip/dialog-modifytrip.component';
@Component({
    selector: 'app-fanpage-admin',
    templateUrl: './fanpage-admin.component.html',
    styleUrls: ['./fanpage-admin.component.css'],
})

export class FanpageAdminComponent implements OnInit {
  displayedColumns: string[] = ['Name','Departure','Destination','Cost','Action'];
  dataSource: MatTableDataSource<Trips>
  public appUsers: AppUsers;
  public tripList = new Array<Trips>();
  idpage;
  trips:any
  @ViewChild(MatPaginator) paginator: MatPaginator;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }
  constructor(private router: Router, private elementRef: ElementRef,@Inject(DOCUMENT) private doc,public pageurl:PageUrl,
  public dialog: MatDialog,private TService:TripService,private PService:PagesService) {

  }
  async ngOnInit() {
    var script = document.createElement("script");
    script.type = "text/javascript";
    script.src = "../assets/js/script.js";
    this.elementRef.nativeElement.appendChild(script);
    this.dataSource = new MatTableDataSource<Trips>();
    this.getTripList();
    this.idpage = this.pageurl.getPageIdStorage();
  }
  CreateTripDialog(): void {
    const dialogRef = this.dialog.open(TripDialogComponent, {
      width: '1200px',
      height: '600px',
    });

    dialogRef.afterClosed().subscribe(result => {
      this.tripList = new Array<Trips>();
      this.getTripList();
    });
  }
  ModifyTripDialog(id): void {
    const dialogRef = this.dialog.open(DialogModifyTripComponent, {
      width: '600px',
      height: '600px',
      data: {idtrip: id}
    });

    dialogRef.afterClosed().subscribe(result => {
      this.tripList = new Array<Trips>();
      this.getTripList();
    });
  }
  getTripList = async () => {
    this.trips = await this.TService.getAllTripsByPageId(this.pageurl.getPageIdStorage())
    for (let i = 0; i < this.trips.length; i++) {
        let trip = new Trips();
        trip.Id = this.trips[i].id.toString()
        trip.Name = this.trips[i].name
        trip.Description = this.trips[i].description
        trip.Content = this.trips[i].content
        trip.Start = this.trips[i].start
        trip.Destination = this.trips[i].destination
        trip.Cost = this.trips[i].cost.toString()
        trip.Image = ApiUrlConstants.API_URL+"/"+this.trips[i].image
        trip.authorId = this.trips[i].authorId
        trip.CreatedDate = this.trips[i].dateCreated
        trip.PageId = this.trips[i].pageId
        const page = await this.PService.getPageById(trip.PageId)
        trip.authorAvatar = ApiUrlConstants.API_URL+"/"+page["avatar"]
        trip.authorName = page["name"]
        trip.Cost = this.trips[i].cost
        this.tripList.push(trip)
    }
    this.dataSource.data = this.tripList
  }
}