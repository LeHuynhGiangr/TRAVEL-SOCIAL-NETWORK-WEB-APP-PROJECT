import { Component, OnInit } from '@angular/core';
import * as  WSMediator  from 'src/assets/js/websocket/WSMediator.js';

//declare const StaticWSMediator :WSMediator.StaticWSMediator
//declare let WebSocketHandler :WSMediator.WebSocketHandler
@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {

  constructor() { 
    //WebSocketHandler = new WSMediator.WebSocketHandler();
  }

  ngOnInit(): void {
  }

}
