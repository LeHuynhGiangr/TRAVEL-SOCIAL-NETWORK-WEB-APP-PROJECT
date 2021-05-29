import { AfterViewInit, Component } from '@angular/core';
import { delay } from 'rxjs/operators';
import { User } from './_core/domain/user';
import { AuthenService } from './_core/services/authen.service';
import { LoginService } from './_core/services/login.service';
import { WebSocketService } from './_core/services/websocket.service';
import * as signalR from '@aspnet/signalr';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  m_user: User
  title = 'ProjectAngular';

  constructor(private m_authenService: AuthenService) {
    const m = 1;
  }

  ngOnInit(): void {  
    // this.getEmployeeData(); 
  } 

  logout() {
    this.m_authenService.logout();
  }
}
