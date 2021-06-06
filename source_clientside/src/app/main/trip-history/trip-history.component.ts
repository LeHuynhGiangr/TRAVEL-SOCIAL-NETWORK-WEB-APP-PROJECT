import { Component, OnInit, ElementRef, Inject, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DatePipe, DOCUMENT } from '@angular/common';
import { Trips } from '../../_core/models/trip.model';
import { TripHistory } from '../../_core/models/trip-history.model';
import {MatTableDataSource} from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { TripService } from 'src/app/_core/services/trip.service';
import { LoginService } from 'src/app/_core/services/login.service';
import { DialogTripHistoryDetailComponent } from './trip-history-detail/trip-history-detail.component';
import { MatDialog } from '@angular/material/dialog';
@Component({
    selector: 'app-trip-history',
    templateUrl: './trip-history.component.html',
    styleUrls: ['./trip-history.component.css'],
    providers: [DatePipe]
})
export class TripHistoryComponent implements OnInit {
    displayedColumns: string[] = ['Name','Departure','Destination','DateStart','DateEnd','DatePayment'];
    dataSource: MatTableDataSource<TripHistory>
    histories: any;
    countlistRequest
    public historiesList = new Array<TripHistory>();
    @ViewChild('MatPaginator') paginator: MatPaginator;
    constructor(private router: Router, private elementRef: ElementRef,@Inject(DOCUMENT) private doc, private TService:TripService,
    private service:LoginService,public datepipe: DatePipe, public dialog: MatDialog) {}
    async ngOnInit(){
        var script = document.createElement("script");
        script.type = "text/javascript";
        script.src = "../assets/js/script.js";
        this.elementRef.nativeElement.appendChild(script);
        this.dataSource = new MatTableDataSource<TripHistory>();
        this.getHistoryList()
        this.dataSource.paginator = this.paginator;
    }
    getHistoryList = async () => {
        this.histories = await this.TService.getPaymentTrip(this.service.getUserIdStorage())
        this.countlistRequest = this.histories.length
        for (let i = 0; i < this.histories.length; i++) {
            let trip = new TripHistory();
            trip.Id = this.histories[i].id
            trip.TripId = this.histories[i].tripId
            let trips = await this.TService.getTripDetail(trip.TripId)
            trip.Name = trips["name"]
            trip.Departure = trips["start"]
            trip.Destination = trips["destination"]
            trip.DateStart = this.datepipe.transform(trips["dateStart"], 'yyyy-MM-dd');
            trip.DateEnd = this.datepipe.transform(trips["dateEnd"], 'yyyy-MM-dd');
            trip.DatePayment = this.datepipe.transform(this.histories[i].dateCreated, 'yyyy-MM-dd');
            this.historiesList.push(trip)
        }
        this.dataSource.data = this.historiesList
    }
    DetailTripHistory(id,datePayment): void {
        const dialogRef = this.dialog.open(DialogTripHistoryDetailComponent, {
          width: '600px',
          height: '600px',
        });
        dialogRef.componentInstance.idTrip = id;
        dialogRef.componentInstance.datePayment = datePayment;
        dialogRef.afterClosed().subscribe(result => {
        });
      }
}