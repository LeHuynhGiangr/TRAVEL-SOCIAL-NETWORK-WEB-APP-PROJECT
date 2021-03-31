import { Component, OnInit, ElementRef, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { DOCUMENT } from '@angular/common';
import { AppUsers } from './../../login/shared/login.model';
import { MatDialog } from '@angular/material/dialog';
import { UserProfile } from '../../_core/data-repository/profile'
import { PostService } from 'src/app/_core/services/post.service';
import { Post } from 'src/app/_core/models/Post';
import { CreatePostRequest } from 'src/app/_core/models/models.request/CreatePostRequest';
import { DialogPostComponent } from '../post/dialog-post/dialog-post.component';
import { ApiUrlConstants } from '../../../../src/app/_core/common/api-url.constants';
import { PostCommentRequest } from 'src/app/_core/models/models.request/post-comment-request.model';
import { PostComment } from 'src/app/_core/models/post-comment.model';
import { PostCommentResponse } from 'src/app/_core/models/models.response/post-comment-response';
import { LoginService } from 'src/app/_core/services/login.service';
@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.css'],
})
export class TimelineComponent implements OnInit {
  public appUsers: AppUsers;
  compareId: boolean;
  play:boolean
  interval;
  time: number = 0;
  public m_posts:Post[];
  constructor(private router: Router, private elementRef: ElementRef, @Inject(DOCUMENT) private doc,
     public dialog: MatDialog,private Pservice:PostService, private service: LoginService) {
  }

  async ngOnInit() {
    var script = document.createElement("script");
    script.type = "text/javascript";
    script.src = "../assets/js/script.js";
    this.elementRef.nativeElement.appendChild(script);
    this.router.routeReuseStrategy.shouldReuseRoute = () =>{
      return false;
    }
    this.appUsers = new AppUsers();
    this.appUsers.Avatar = ApiUrlConstants.API_URL + "/" + this.service.getAvatarStorage()
    this.loadPostData();
    this.startTimer()
  }
  commentPost(postCmtRequest:PostCommentRequest){
    alert("inside newfeed");
    if(!postCmtRequest)return;
    this.Pservice.commentPost(postCmtRequest).subscribe((jsonData:PostCommentResponse) => { 
      const l_postComment: PostComment={
        Id:jsonData.userId,
        Name:jsonData.name,
        Comment:jsonData.comment,
      };
      ;this.m_posts.find(_=>_.id == postCmtRequest.PostId).commentJson.push(l_postComment)});
    this.loadPostData();
    this.router.routeReuseStrategy.shouldReuseRoute = () =>{
      return false;
    }
  }
  startTimer() {
    this.play = true;
    this.interval = setInterval(() => {
      this.time++;
      if(this.time>=100)
      {
        this.play = false
        clearInterval(this.interval);
      }
    },50)
  }

  createPost(newPost:CreatePostRequest){
    if(!newPost)return;
      this.Pservice.createPost(newPost).subscribe((jsonData:Post)=>this.m_posts.unshift(jsonData));
    this.loadPostData();
    this.router.routeReuseStrategy.shouldReuseRoute = () =>{
      return false;
    }
  }
  createpostDialog(): void {
    const dialogRef = this.dialog.open(DialogPostComponent, {
      width: '600px',
      height: '400px',
      data: { Id: this.appUsers.Id }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      console.log(result);
      if(dialogRef.componentInstance.isCloseByCancelBtn==0){
        const base64String=dialogRef.componentInstance.m_image;
        const createPostRequest: CreatePostRequest={
          userId:localStorage.getItem('userId').toString(),
          status: dialogRef.componentInstance.m_status,
          base64Str:base64String || "",
        };
        this.createPost(createPostRequest);
      }
    });
  }

  loadPostData(){
    this.Pservice.getPostById(UserProfile.IdTemp).subscribe((jsonData:Post[])=>this.m_posts=jsonData);
  }
}
