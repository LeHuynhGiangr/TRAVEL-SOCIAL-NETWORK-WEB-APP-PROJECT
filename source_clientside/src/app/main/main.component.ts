import { Component, OnInit } from '@angular/core';
import { WebSocketService } from '../_core/services/websocket.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit{

  constructor(private webSocketService:WebSocketService) {
  }

  ngOnInit(): void {
  }
}
