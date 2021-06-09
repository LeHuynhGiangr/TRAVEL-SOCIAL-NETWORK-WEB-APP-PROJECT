import { Component, Input, OnInit, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { Observable } from 'rxjs';
import { SystemConstants } from 'src/app/_core/common/system.constants';

@Component({
  selector: 'app-chat-area',
  templateUrl: './chat-area.component.html',
  styleUrls: ['./chat-area.component.css']
})
export class ChatAreaComponent implements OnInit {
  @ViewChild('chattingArea') private myScrollContainer: ElementRef;
  @ViewChild('textArea') private textArea: ElementRef

  @Output() submitMessageEvent = new EventEmitter<string>();
  @Input() public messageUnits: Observable<any[]> = new Observable<any[]>();
  private userId: string

  constructor() { }

  ngOnInit(): void {
    this.userId = sessionStorage.getItem(SystemConstants.USERID_KEY);
  }

  isFriend(userId: string) {
    if (userId == this.userId) {
      return false;
    }
    return true;
  }

  messageForSubmit: string = "";
  onTextareaChanged(event: any) {
    this.messageForSubmit = event.target.value;
    console.log(this.messageForSubmit);
  }
  onSubmitBtnClicked() {
    this.messageForSubmit = this.messageForSubmit.trim();
    console.log(this.messageForSubmit);
    if (this.messageForSubmit.trim() === "") return;
    this.submitMessageEvent.emit(this.messageForSubmit);
    this.textArea.nativeElement.value = "";
    this.scrollChatBoxToBottom();
  }

  scrollChatBoxToBottom() {
    this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
  }
}
