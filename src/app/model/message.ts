import { IUser } from "./user";
import { Thread } from "./thread";

export interface IMessage {
    id: string;
    sentAt: Date;
    isRead: boolean;
    author: IUser;
    text: string;
    thread: Thread;
    receiver: IUser;

}

export class Message implements IMessage{
    id: string;
    sentAt: Date;
    isRead: boolean;
    author: IUser;
    text: string;
    thread: Thread;
    receiver: IUser;
  
    constructor(obj?: any) {
      this.id = obj && obj.id;
      this.isRead = obj && obj.isRead || false;
      this.sentAt = obj && obj.sentAt || new Date();
      this.author = obj && obj.author || null;
      this.text = obj && obj.text || null;
      this.thread = obj && obj.thread || null;
      this.receiver = obj && obj.receiver || null;
    }
  }