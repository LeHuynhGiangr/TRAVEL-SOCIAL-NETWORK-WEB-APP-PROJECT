import { Component, OnInit, ElementRef, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { DOCUMENT } from '@angular/common';
import { AppUsers } from './../../login/shared/login.model';
import { PageUrl } from 'src/app/_helpers/get-page-url';
import { MatDialog } from '@angular/material/dialog';
import { TripDialogComponent } from '../trip/trip-dialog/trip-dialog.component';
import {animate, state, style, transition, trigger} from '@angular/animations';
@Component({
    selector: 'app-fanpage-admin',
    templateUrl: './fanpage-admin.component.html',
    styleUrls: ['./fanpage-admin.component.css'],
    animations: [
      trigger('detailExpand', [
        state('collapsed', style({height: '0px', minHeight: '0'})),
        state('expanded', style({height: '*'})),
        transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
      ]),
    ],
})

export class FanpageAdminComponent implements OnInit {
  dataSource = ELEMENT_DATA;
  columnsToDisplay = ['TripName', 'TotalTime', 'Destination', 'Cost'];
  expandedElement: PeriodicElement | null;
  public appUsers: AppUsers;
  idpage;
  constructor(private router: Router, private elementRef: ElementRef,@Inject(DOCUMENT) private doc,public pageurl:PageUrl,
  public dialog: MatDialog) {

  }
  async ngOnInit() {
    var script = document.createElement("script");
    script.type = "text/javascript";
    script.src = "../assets/js/script.js";
    this.elementRef.nativeElement.appendChild(script);
    
    this.idpage = this.pageurl.getPageIdStorage();
  }
  CreateTripDialog(): void {
    const dialogRef = this.dialog.open(TripDialogComponent, {
      width: '600px',
      height: '600px',
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }
}
export interface PeriodicElement {
  TripName: string;
  Cost: number;
  TotalTime: number;
  Destination: string;
  description: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {
    Cost: 1,
    TripName: 'Hydrogen',
    TotalTime: 1.0079,
    Destination: 'H',
    description: `Hydrogen is a chemical element with Destination H and atomic number 1. With a standard
        atomic TotalTime of 1.008, hydrogen is the lightest element on the periodic table.`
  }, {
    Cost: 2,
    TripName: 'Helium',
    TotalTime: 4.0026,
    Destination: 'He',
    description: `Helium is a chemical element with Destination He and atomic number 2. It is a
        colorless, odorless, tasteless, non-toxic, inert, monatomic gas, the first in the noble gas
        group in the periodic table. Its boiling point is the lowest among all the elements.`
  }, {
    Cost: 3,
    TripName: 'Lithium',
    TotalTime: 6.941,
    Destination: 'Li',
    description: `Lithium is a chemical element with Destination Li and atomic number 3. It is a soft,
        silvery-white alkali metal. Under standard conditions, it is the lightest metal and the
        lightest solid element.`
  }, {
    Cost: 4,
    TripName: 'Beryllium',
    TotalTime: 9.0122,
    Destination: 'Be',
    description: `Beryllium is a chemical element with Destination Be and atomic number 4. It is a
        relatively rare element in the universe, usually occurring as a product of the spallation of
        larger atomic nuclei that have collided with cosmic rays.`
  }, {
    Cost: 5,
    TripName: 'Boron',
    TotalTime: 10.811,
    Destination: 'B',
    description: `Boron is a chemical element with Destination B and atomic number 5. Produced entirely
        by cosmic ray spallation and supernovae and not by stellar nucleosynthesis, it is a
        low-abundance element in the Solar system and in the Earth's crust.`
  }, {
    Cost: 6,
    TripName: 'Carbon',
    TotalTime: 12.0107,
    Destination: 'C',
    description: `Carbon is a chemical element with Destination C and atomic number 6. It is nonmetallic
        and tetravalent—making four electrons available to form covalent chemical bonds. It belongs
        to group 14 of the periodic table.`
  }, {
    Cost: 7,
    TripName: 'Nitrogen',
    TotalTime: 14.0067,
    Destination: 'N',
    description: `Nitrogen is a chemical element with Destination N and atomic number 7. It was first
        discovered and isolated by Scottish physician Daniel Rutherford in 1772.`
  }, {
    Cost: 8,
    TripName: 'Oxygen',
    TotalTime: 15.9994,
    Destination: 'O',
    description: `Oxygen is a chemical element with Destination O and atomic number 8. It is a member of
         the chalcogen group on the periodic table, a highly reactive nonmetal, and an oxidizing
         agent that readily forms oxides with most elements as well as with other compounds.`
  }, {
    Cost: 9,
    TripName: 'Fluorine',
    TotalTime: 18.9984,
    Destination: 'F',
    description: `Fluorine is a chemical element with Destination F and atomic number 9. It is the
        lightest halogen and exists as a highly toxic pale yellow diatomic gas at standard
        conditions.`
  }, {
    Cost: 10,
    TripName: 'Neon',
    TotalTime: 20.1797,
    Destination: 'Ne',
    description: `Neon is a chemical element with Destination Ne and atomic number 10. It is a noble gas.
        Neon is a colorless, odorless, inert monatomic gas under standard conditions, with about
        two-thirds the density of air.`
  },
];
