import { Component, OnInit, ElementRef } from '@angular/core';
import { Observable } from "rxjs/Observable";
import { IMessage, Message } from '../model/message';
import { ThreadService } from '../services/thread.service';
import { Thread } from '../model/thread';
import { UserService } from '../services/user.service';
import { IUser } from '../model/user';
import { MessageService } from '../services/message.service';
import { SocketClientService } from '../services/socket-client.service';

@Component({
  selector: 'chat-window',
  templateUrl: './chat-window.component.html',
  styleUrls: ['./chat-window.component.css']
})
export class ChatWindowComponent implements OnInit {
  messages: Observable<IMessage[]>;
  draftMessage: IMessage;
  currentThread: Thread;
  draftText: string;
  constructor(public threadService: ThreadService,
    public userService: UserService,
    public messageService: MessageService,
    public el: ElementRef,
    public socketClientService: SocketClientService) {
    this.threadService.currentThread
      .subscribe((thread: Thread) => this.currentThread = thread);

    this.threadService.newMessage
      .subscribe((message: IMessage) => {
        this.currentThread.messages.push(message);
        setTimeout(() => {
          this.scrollToBottom();
        });
      });
  }

  ngOnInit() {

  }

  onEnter(event) {
    this.sendMessage();
    event.preventDefault();
  }

  sendMessage() {
    const m: IMessage = new Message();
    m.isRead = true;
    m.text = this.draftText;
    m.author = this.userService.currentUser;
    m.receiver = this.currentThread.author;
    this.currentThread.messages.push(m);
    this.socketClientService.sendMessage(m);

    //this.currentThread.messages.concat(m);
    this.draftText = "";
    setTimeout(() => { this.scrollToBottom() }, 0);
  }

  scrollToBottom(): void {
    const scrollPane: any = this.el.nativeElement.querySelector('.msg-container-base');
    scrollPane.scrollTop = scrollPane.scrollHeight;
  }

}
