import { Component, OnInit, Input } from '@angular/core';
import { IMessage } from '../model/message';
import { UserService } from '../services/user.service';

@Component({
  selector: 'chat-message',
  templateUrl: './chat-message.component.html',
  styleUrls: ['./chat-message.component.css']
})
export class ChatMessageComponent implements OnInit {
  @Input() message: IMessage;
  incoming = false;
  constructor(private userService: UserService) {
   
  }

  ngOnInit() {
    if (this.message.author._id === this.userService.currentUser._id)
    this.incoming = true;
  }

}
