import { Component, OnInit } from '@angular/core';
import { ChattingService } from 'src/app/_core/services/chatting.service';
import { UriHandler } from 'src/app/_helpers/uri-handler';

@Component({
  selector: 'app-right-sidebar-list-friend',
  templateUrl: './right-sidebar-list-friend.component.html',
  styleUrls: ['./right-sidebar-list-friend.component.css']
})
export class RightSidebarListFriendComponent implements OnInit {
  display: boolean = false;

  public m_friends:{
    Id:string,
    Name:string,
    avarThumb:string
  }[]
  constructor(public m_chattingService:ChattingService, public m_uriHandler:UriHandler) {
    this.loadFriendData();
  }

  ngOnInit(): void {
    this.loadFriendData();
  }
  loadFriendData(){
    this.m_chattingService.getFriendDataById().subscribe(jsonData => {
      this.m_friends=jsonData.friendJsonString});
  }
  showDialog() {
    this.display = true;
  }
}
