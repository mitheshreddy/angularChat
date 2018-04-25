import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { IMessage } from '../model/message';
import { Observable } from 'rxjs/Observable';
import { ThreadService } from './thread.service';

interface IMessagesOperation extends Function {
  (messages: IMessage[]): IMessage[];
}

@Injectable()
export class MessageService {
  setCurrentChatUser: Subject<any> = new Subject<any>();
  newMessages: Subject<IMessage> = new Subject<IMessage>();

  // `messages` is a stream that emits an array of the most up to date messages
  messages: Observable<IMessage[]>;

  updates: Subject<any> = new Subject<any>();

  // action streams
  create: Subject<IMessage> = new Subject<IMessage>();
  mes: IMessage[] = [];

  constructor(private threadService: ThreadService) {
    this.newMessages
      .subscribe(this.create);  
  }

  addMessage(message: IMessage): void {
    this.newMessages.next(message);
  }

}
