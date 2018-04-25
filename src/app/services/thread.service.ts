import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { Thread } from '../model/thread';
import { IUser } from '../model/user';
import { SocketClientService } from './socket-client.service';
import { IMessage, Message } from '../model/message';
import { UserService } from './user.service';
import { DataService } from './data.service';

@Injectable()
export class ThreadService {
  currentUser: Subject<any> = new Subject<any>();
  threads: Observable<{ [key: string]: Thread }>;
  threadsMap: { [key: string]: Thread } = {};
  currentThread: Observable<any>;
  newMessage: Subject<any> = new Subject<any>();
  constructor(private socketService: SocketClientService, private userService: UserService, private dataService: DataService) {
    this.currentThread = this.currentUser
      .map((user: IUser) => {
        try {
          if (this.threadsMap[user._id] === undefined) {
            let currentChatUser = userService.tempUsers[user._id];
            let thread = new Thread(user._id, user.name, user.avatarSrc, currentChatUser);
            thread.messages = this.getMessagesFromDB(user._id);
            this.threadsMap[thread.id] = thread;

          }
        } catch (e) { console.log(e) }
        return this.threadsMap[user._id];
      });

    socketService.incomingMessage
      .subscribe((message: IMessage) => {
        if (userService.currentUser._id === message.receiver._id) {
          this.currentUser.next(message.author);
          this.newMessage.next(message);
        }

      });

  }

  getMessagesFromDB(_id: string): IMessage[] {
    let messagesArray: IMessage[] = [],
    userService = this.userService;
    let obj = {id1: userService.currentUserId, id2: _id};
    this.dataService.getMessages(obj)
      .subscribe((messages: any) => {
        messages.map((element: any) => {
          let obj: any = {
            id: element.id,
            sentAt: element.sentAt,
            isRead: element.isRead,
            author: userService.tempUsers[element.author_id],
            text: element.text,
            receiver: userService.tempUsers[element.reciever_id]
          }

          messagesArray.push(new Message(obj));
        });

      });

      return messagesArray;
  }

}
