import { Component, OnInit, ElementRef, Inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DOCUMENT } from '@angular/common';
import { AppUsers } from './../../login/shared/login.model';
import { LoginService } from '../../_core/services/login.service';
import { TimeLineService } from '../../_core/services/timeline.service';
import { MatDialog } from '@angular/material/dialog';
import { DialogUploadAvatarComponent } from './dialog-uploadavatar/dialog-uploadavatar.component';
import { DialogUploadBackgroundComponent } from './dialog-uploadbackground/dialog-uploadbackground.component';
import { UserProfile } from '../../_core/data-repository/profile'
import { UriHandler } from 'src/app/_helpers/uri-handler';
import { TimelineUrl } from 'src/app/_helpers/get-timeline-url';
import { PostService } from 'src/app/_core/services/post.service';
import { Post } from 'src/app/_core/models/Post';
import { CreatePostRequest } from 'src/app/_core/models/models.request/CreatePostRequest';
import { DialogPostComponent } from '../post/dialog-post/dialog-post.component';
import { ApiUrlConstants } from '../../../../src/app/_core/common/api-url.constants';
import { PostCommentRequest } from 'src/app/_core/models/models.request/post-comment-request.model';
import { PostComment } from 'src/app/_core/models/post-comment.model';
import { PostCommentResponse } from 'src/app/_core/models/models.response/post-comment-response';
import { EditBasicService } from 'src/app/_core/services/edit-basic.service';
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
  constructor(private router: Router, private route: ActivatedRoute, private elementRef: ElementRef, @Inject(DOCUMENT) private doc,
    private service: LoginService, private Tservice: TimeLineService, public dialog: MatDialog, public uriHandler: UriHandler,
    public timelineurl:TimelineUrl, private Pservice:PostService) {
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
    if(UserProfile.Id==UserProfile.IdTemp)
    {
      this.compareId =true
      this.appUsers.Id = UserProfile.Id
      this.appUsers.FirstName = this.service.getFirstNameStorage()
      this.appUsers.LastName = UserProfile.LastName
      this.appUsers.Avatar = ApiUrlConstants.API_URL+"/"+UserProfile.Avatar
      this.appUsers.Background = ApiUrlConstants.API_URL+"/"+UserProfile.Background
    }
    if(UserProfile.Id!=UserProfile.IdTemp)
    {
      this.compareId =false
      const user =await this.service.getUserById(UserProfile.IdTemp)
      this.appUsers.FirstName = user["firstName"]
      this.appUsers.LastName = user["lastName"]
      this.appUsers.Background = ApiUrlConstants.API_URL+"/"+user["background"]
      this.appUsers.Avatar = ApiUrlConstants.API_URL+"/"+UserProfile.Avatar
    }
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
  onLogout() {
    this.service.logout();
    this.router.navigateByUrl('/login');
  }
  onFileChanged(event) {
    this.appUsers.Avatar = event.target.files[0]
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
  openDialog(): void {
    const dialogRef = this.dialog.open(DialogUploadAvatarComponent, {
      width: '500px',
      height: '400px',
      data: { Id: this.appUsers.Id }
    });
    dialogRef.afterClosed().subscribe(result => {
      this.router.routeReuseStrategy.shouldReuseRoute = () =>{
        return false;
      }
      console.log('The dialog was closed');
      this.service.getUser().then(user => {
        if (user) {
          this.appUsers.Avatar = ApiUrlConstants.API_URL+"/"+user["avatar"]
          UserProfile.Avatar = user["avatar"]
        }
      });
    });
  }
  openDialogBackground(): void {
    const dialogRef = this.dialog.open(DialogUploadBackgroundComponent, {
      width: '500px',
      height: '400px',
      data: { Id: this.appUsers.Id }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.service.getUser().then(user => {
        if (user) {
          this.appUsers.Background = ApiUrlConstants.API_URL+"/"+ user["background"]
          UserProfile.Background = user["background"]
        }
      });

    });
  }
  loadPostData(){
    this.Pservice.getPostById(UserProfile.IdTemp).subscribe((jsonData:Post[])=>this.m_posts=jsonData);
  }
}
