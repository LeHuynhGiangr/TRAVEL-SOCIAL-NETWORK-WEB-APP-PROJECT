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
import { DialogPassengersComponent } from './dialog-passengers/dialog-passengers.component';
import { TripHistory } from 'src/app/_core/models/trip-history.model';
import * as XLSX from 'xlsx';
import { DialogDiscountComponent } from '../fanpage-discount/dialog-discount/dialog-discount.component';
import { Discount } from 'src/app/_core/models/discount.model';
import { DiscountService } from 'src/app/_core/services/discount.service';
import { MenuItem } from 'primeng/api';
@Component({
    selector: 'app-fanpage-admin',
    templateUrl: './fanpage-admin.component.html',
    styleUrls: ['./fanpage-admin.component.css'],
})

export class FanpageAdminComponent implements OnInit {
  displayedColumns: string[] = ['Name','Departure','Destination','Cost','Action'];
  displayeddisColumns: string[] = ['Name','CodeDiscount','DiscountPer','Active','DateExpired','Action'];
  dataSource: MatTableDataSource<Trips>
  dataSourcedis: MatTableDataSource<Discount>
  public appUsers: AppUsers;
  public tripList = new Array<Trips>();
  idpage;
  trips:any
  tripcount:number
  dis_count:number
  discounts:any
  public discountList = new Array<Discount>();
  public passengerList = new Array<TripHistory>();
  public reportList = new Array<TripHistory>();
  title = 'angular-app';
  fileName= 'ExcelSheet.xlsx';
  totalPrice:number
  items: MenuItem[];
  @ViewChild('MatPaginator1') MatPaginator1: MatPaginator;
  @ViewChild('MatPaginator2') MatPaginator2: MatPaginator;
  ngAfterViewInit() {
    this.dataSource.paginator = this.MatPaginator1;
    this.dataSourcedis.paginator = this.MatPaginator2;
  }
  constructor(private router: Router, private elementRef: ElementRef,@Inject(DOCUMENT) private doc,public pageurl:PageUrl,
  public dialog: MatDialog,private TService:TripService,private PService:PagesService, private DService: DiscountService) {

  }
  async ngOnInit() {
    var script = document.createElement("script");
    script.type = "text/javascript";
    script.src = "../assets/js/script.js";
    this.elementRef.nativeElement.appendChild(script);
    this.items = [
      {label: 'Block', icon: 'pi pi-lock', command: () => {
        alert("ok");
      }},
      {label: 'Delete', icon: 'pi pi-trash', command: () => {
        alert("ok");
      }}
    ]
    this.dataSource = new MatTableDataSource<Trips>();
    this.dataSourcedis = new MatTableDataSource<Discount>();
    this.totalPrice = 0
    this.getTripList()
    this.getDiscountList()
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
  DetailPassengers(id): void {
    const dialogRef = this.dialog.open(DialogPassengersComponent, {
      width: '800px',
      height: '400px',
    });
    dialogRef.componentInstance.idTrip = id;
    dialogRef.afterClosed().subscribe(result => {
    });
  }
  getTripList = async () => {
    this.trips = await this.TService.getAllTripsByPageId(this.pageurl.getPageIdStorage())
    this.tripcount = this.trips.length
    for (let i = 0; i < this.trips.length; i++) {
        let trip = new Trips();
        trip.Id = this.trips[i].id.toString()
        this.getListPassengers(trip.Id)
        trip.Name = this.trips[i].name
        trip.Description = this.trips[i].description
        trip.Content = this.trips[i].content
        trip.Start = this.trips[i].start
        trip.Destination = this.trips[i].destination
        trip.Cost = this.trips[i].cost.toString()
        trip.Image = ApiUrlConstants.API_URL+"/"+this.trips[i].image
        trip.authorId = this.trips[i].authorId
        trip.CreatedDate = this.trips[i].dateCreated
        trip.Active = this.trips[i].active
        trip.PageId = this.trips[i].pageId
        const page = await this.PService.getPageById(trip.PageId)
        trip.authorAvatar = ApiUrlConstants.API_URL+"/"+page["avatar"]
        trip.authorName = page["name"]
        trip.Cost = this.trips[i].cost
        this.tripList.push(trip)
    }
    this.dataSource.data = this.tripList
  }
  getDiscountList = async () => {
    this.discounts = await this.DService.getListDiscountByPageId(this.pageurl.getPageIdStorage())
    this.dis_count = this.discounts.length
    for (let i = 0; i < this.discounts.length; i++) {
        let discount = new Discount();
        discount.Id = this.discounts[i].id.toString()
        discount.Name = this.discounts[i].name
        discount.CodeDiscount = this.discounts[i].codeDiscount
        discount.Active = this.discounts[i].active
        discount.DiscountPer = this.discounts[i].discountPer
        discount.LimitCost = this.discounts[i].limitCost
        discount.LimitPassenger = this.discounts[i].limitPassenger
        discount.DateExpired = this.discounts[i].dateExpired
        discount.DateCreate = this.discounts[i].dateCreated
        discount.PageId = this.discounts[i].pageId
        this.discountList.push(discount)
    }
    this.dataSourcedis.data = this.discountList
  }
  async getListPassengers(id)
    {
        const passengers = await this.TService.getFriendInTrip(id) as Array<any>;

        const passengerList = [];

        for (let i = 0; i < passengers.length; i++)
        {
          const passenger = new TripHistory();
          passenger.TripId = passengers[i].tripId
          const tripconst = await this.TService.getTripDetail(passenger.TripId)
          passenger.TripName = tripconst["name"]
          passenger.Name = passengers[i].name
          passenger.PhoneNumber = passengers[i].phoneNumber
          passenger.Email = passengers[i].email
          passenger.Address = passengers[i].address
          passenger.Requirements = passengers[i].requirements
          passenger.PeopleNumber = passengers[i].peopleNumber
          passenger.DateCreated = passengers[i].dateCreated
          passenger.CostPayment = passengers[i].costPayment
          this.totalPrice = Number(this.totalPrice) + Number(passenger.CostPayment)
          passengerList.push(passenger);
        }
        this.reportList = this.reportList.concat(passengerList);
    }
    exportexcel(): void
    {
      /* pass here the table id */
      let element = document.getElementById('excel-table');
      const ws: XLSX.WorkSheet =XLSX.utils.table_to_sheet(element);
      var wscols = [
        {wch:30},
        {wch:20},
        {wch:25},
        {wch:20},
        {wch:15},
        {wch:20},
        {wch:10},
        {wch:15}
    ];
      ws['!cols'] = wscols
      /* generate workbook and add the worksheet */
      const wb: XLSX.WorkBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
   
      /* save to file */  
      XLSX.writeFile(wb, this.fileName);
   
    }
    openDialogDiscount(): void {
      const dialogRef = this.dialog.open(DialogDiscountComponent, {
        width: '500px',
        height: '500px',
      });
      dialogRef.afterClosed().subscribe(async result => {
        this.router.routeReuseStrategy.shouldReuseRoute = () =>{
          return false;
        }
        this.discountList = new Array<Discount>();
        this.getDiscountList();
      });
    }
}