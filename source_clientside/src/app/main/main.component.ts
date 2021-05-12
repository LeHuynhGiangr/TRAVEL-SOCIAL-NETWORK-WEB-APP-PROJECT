import { Component, OnInit } from '@angular/core';
import { WebSocketService } from '../_core/services/websocket.service';
import {StaticWSMediator} from '../../../src/assets/js/websocket/WSMediator.js';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {

  constructor(private webSocketService:WebSocketService) {
    StaticWSMediator.register(this.OnWsOpened, WebSocketService._SYS_TOKEN_DEF.ON_OPENED);
    //this.webSocketService.sendMessage(localStorage.getItem('userId').toString());
    this.OnWsOpened();
  }

  ngOnInit(): void {
  }

  OnWsOpened():void{
    this.webSocketService.sendMessage(localStorage.getItem('userId').toString());
  }
}
