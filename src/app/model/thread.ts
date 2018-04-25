import { IMessage } from "./message";
import { IUser } from "./user";

export class Thread {
  id: string;
  lastMessage: IMessage;
  name: string;
  avatarSrc: string;
  messages: IMessage[];
  author: IUser;
  private _loadMessagesFromDB: boolean;
  
  constructor(id?: string,
    name?: string,
    avatarSrc?: string,
    author?: IUser) {
    this.id = id;
    this.name = name;
    this.avatarSrc = avatarSrc;
    this.messages = [];
    this.author = author;
    this._loadMessagesFromDB = false;
  }

  set loadMessagesFromDB(value: boolean) {
    this._loadMessagesFromDB = value;
  }

  
}