import { Component, Input, OnInit, Output, EventEmitter} from '@angular/core';
import { SystemConstants } from 'src/app/_core/common/system.constants';

@Component({
  selector: 'app-chat-area',
  templateUrl: './chat-area.component.html',
  styleUrls: ['./chat-area.component.css']
})
export class ChatAreaComponent implements OnInit {

  @Output() submitMessageEvent = new EventEmitter<string>();
  @Input() public messageUnits: any[];
  private userId: string

  constructor() { }

  ngOnInit(): void {
    this.userId = sessionStorage.getItem(SystemConstants.USERID_KEY);
  }

  isFriend(userId: string) {
    if (userId === this.userId) {
      return false;
    }
    return true;
  }

  messageForSubmit:string = "";
  onTextareaChanged(event:any){
    this.messageForSubmit = event.target.value;
    console.log(this.messageForSubmit);
  }
  onSubmitBtnClicked(){
    this.messageForSubmit = this.messageForSubmit.trim();
    console.log(this.messageForSubmit);
    if (this.messageForSubmit.trim() === "") return;
    this.submitMessageEvent.emit(this.messageForSubmit);
  }
}
