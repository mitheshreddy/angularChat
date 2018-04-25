import { Injectable } from '@angular/core';
import * as io from "socket.io-client";
import { IUser } from '../model/user';
import { Subject } from 'rxjs/Subject';
import { IMessage } from '../model/message';

@Injectable()
export class SocketClientService {

  socket = io.connect();
  userOnline: Subject<any> = new Subject<any>();
  userOffline: Subject<any> = new Subject<any>();
  incomingMessage: Subject<any> = new Subject<any>();

  constructor() { 
    this.socket.on('onlineUsers', (user: IUser) => {
      console.log("User connected");
      this.onlineUsersSignal(user);
    });
    this.socket.on('disconnectedUsers', (_id: string) => {
      console.log("User disconnected");
      console.log(_id);
      this.offlineUserSignal(_id);
    });

    this.socket.on('incomingMessage', (message: IMessage) => {
      console.log("Incooming message");
      this.onIncomingMessage(message);
    });

  }

  sendOnlineSignal(user) {
    this.socket.emit('online', user);
  }  

  onlineUsersSignal(user: IUser) {
    this.userOnline.next(user);
  }

  offlineUserSignal(_id: string) {
    this.userOffline.next(_id);
  }

  sendMessage(message: IMessage) {
    this.socket.emit("message", message);
  }

  onIncomingMessage(message: IMessage) {
    this.incomingMessage.next(message);
  }

}
