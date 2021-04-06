import { Input, Output, EventEmitter } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { UtilityService } from 'src/app/_core/services/utility.service';
import { UriHandler } from 'src/app/_helpers/uri-handler';
import { ActivatedRoute, Router } from '@angular/router';
import { UserProfile } from 'src/app/_core/data-repository/profile';
import { AppUsers } from '../../../login/shared/login.model';
import { ApiUrlConstants } from '../../../../../src/app/_core/common/api-url.constants';
import { PostComment } from 'src/app/_core/models/post-comment.model';
import { PostService } from 'src/app/_core/services/post.service';
import { PrimeNGConfig } from 'primeng/api';  
import {MenuItem, PrimeIcons} from 'primeng/api';
import { LoginService } from 'src/app/_core/services/login.service';
@Component({
  selector: 'app-comment-area',
  templateUrl: './comment-area.component.html',
  styleUrls: ['./comment-area.component.css']
})
export class CommentAreaComponent implements OnInit {
  @Input() commentJson:PostComment[]
  @Output() submitCommentEvent = new EventEmitter<string>();
  public m_returnUrl: string;
  public appUsers: AppUsers;
  constructor(private m_postService:PostService, private service : LoginService, public m_utility:UtilityService, public uriHandler:UriHandler,private m_route: ActivatedRoute, private m_router: Router) {
   }

  ngOnInit(): void {
    this.appUsers = new AppUsers();
    this.appUsers.Avatar =ApiUrlConstants.API_URL + "/" + this.service.getAvatarStorage();
  }

  getNavigation( id) {
    this.m_returnUrl = this.m_route.snapshot.queryParams['returnUrl'] || '/main/timeline/'+id;
    UserProfile.IdTemp = id.toString()
    this.m_router.navigateByUrl(this.m_returnUrl, {skipLocationChange:true});
  }

  getImageComment(avatarThumb){
    return ApiUrlConstants.API_URL + "/"+avatarThumb
  }

  OnKeyUpTxtAreaEvent(event:any){
    var comment:string = event.target.value;
    comment = comment.trim();
    if (comment.trim() === "") return
    this.submitCommentEvent.emit(comment.toString());
    event.target.value="";
  }
}