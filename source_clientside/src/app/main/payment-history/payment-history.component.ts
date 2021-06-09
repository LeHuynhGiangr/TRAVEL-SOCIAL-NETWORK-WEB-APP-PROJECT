import { Component, OnInit, ElementRef, Inject, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DatePipe, DOCUMENT } from '@angular/common';
import { TripHistory } from '../../_core/models/trip-history.model';
import {MatTableDataSource} from '@angular/material/table';
import {MatSort} from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { TripService } from 'src/app/_core/services/trip.service';
import { LoginService } from 'src/app/_core/services/login.service';
@Component({
    selector: 'app-payment-history',
    templateUrl: './payment-history.component.html',
    styleUrls: ['./payment-history.component.css'],
    providers: [DatePipe]
})
export class PaymentHistoryComponent implements OnInit {
    displayedColumns: string[] = ['Name','CostPayment','DatePayment'];
    dataSource: MatTableDataSource<TripHistory>
    histories: any;
    countlistRequest
    public historiesList = new Array<TripHistory>();
    @ViewChild('MatPaginatorTrip') paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    constructor(private router: Router, private elementRef: ElementRef,@Inject(DOCUMENT) private doc, private TService:TripService,
    private service:LoginService,public datepipe: DatePipe ) {}
    ngOnInit() {
        var script = document.createElement("script");
        script.type = "text/javascript";
        script.src = "../assets/js/script.js";
        this.elementRef.nativeElement.appendChild(script);

        this.dataSource = new MatTableDataSource<TripHistory>();
        this.getPaymentHistoryList()
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
    }
    getPaymentHistoryList = async () => {
        this.histories = await this.TService.getPaymentTrip(this.service.getUserIdStorage())
        this.countlistRequest = this.histories.length
        for (let i = 0; i < this.histories.length; i++) {
            let trip = new TripHistory();
            trip.Id = this.histories[i].id
            trip.TripId = this.histories[i].tripId
            trip.CostPayment = this.histories[i].costPayment
            let trips = await this.TService.getTripDetail(trip.TripId)
            trip.Name = trips["name"]
            trip.DatePayment = this.datepipe.transform(this.histories[i].dateCreated, 'yyyy-MM-dd');
            this.historiesList.push(trip)
        }
        this.dataSource.data = this.historiesList
    }
}