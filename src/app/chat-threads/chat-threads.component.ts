import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { UserService } from '../services/user.service';
import { IUser } from '../model/user';

@Component({
  selector: 'chat-threads',
  templateUrl: './chat-threads.component.html',
  styleUrls: ['./chat-threads.component.css']
})
export class ChatThreadsComponent implements OnInit {
  users: Observable<any>;

  constructor(private userService: UserService) { 
    
  }

  ngOnInit() {
    this.users = this.userService.users;
    this.userService.users.subscribe((users: IUser[]) => {
      console.log(users);
    });
  }

}
