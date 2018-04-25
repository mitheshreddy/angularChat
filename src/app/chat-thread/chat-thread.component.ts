import { Component, OnInit, Input } from '@angular/core';
import { IUser } from '../model/user';
import { ThreadService } from '../services/thread.service';

@Component({
  selector: 'chat-thread',
  templateUrl: './chat-thread.component.html',
  styleUrls: ['./chat-thread.component.css']
})
export class ChatThreadComponent implements OnInit {
  @Input() user: IUser;
  
  selected = false;

  constructor(private threadService: ThreadService) { }

  ngOnInit() {
  }

  clicked(event: any): void {
    this.threadService.currentUser.next(this.user);
  }

}
