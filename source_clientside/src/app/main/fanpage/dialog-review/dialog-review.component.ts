import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogData } from 'src/app/_core/models/DialogData';
import { Ratings } from 'src/app/_core/models/rating.model';
import { LoginService } from 'src/app/_core/services/login.service';
import { RatingService } from 'src/app/_core/services/rating.service';
import { PageUrl } from 'src/app/_helpers/get-page-url';
@Component({
    selector: 'app-dialog-review',
    templateUrl: './dialog-review.component.html',
    styleUrls: ['./dialog-review.component.css']
  })
export class DialogReviewComponent implements OnInit {
    public uratings : Ratings
    constructor(public dialogRef: MatDialogRef<DialogReviewComponent>, @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private RService:RatingService,public pageurl:PageUrl,private service: LoginService){}
    ngOnInit() {
        this.uratings = new Ratings();
        this.uratings.Content = ''
        this.uratings.Rating = 0
        this.uratings.Active = true
        this.uratings.PageId = this.pageurl.getPageIdStorage()
        this.uratings.UserId = this.service.getUserIdStorage()
    }
    onNoClick(): void {
        this.dialogRef.close();
    }
    addReview = async (review) => {
        try {
          const result = await this.RService.postRating(review);
          alert('Add sucessfully');    
        }
        catch (e) {
          alert('Add failed');
        }
        this.dialogRef.close();
      };
}