import { Injectable } from '@angular/core';
import { DataService } from './data.service';
import { Subject } from 'rxjs/Subject';
import { IUser } from '../model/user';
import { Observable } from 'rxjs/Observable';
import "rxjs/add/operator/map";
import "rxjs/add/operator/scan";
import "rxjs/add/observable/of";
import { SocketClientService } from './socket-client.service';

const initialUsers: IUser[] = [];
interface IUsersOperation extends Function {
  (user: IUser[]): IUser[];
}


@Injectable()
export class UserService {

  create: Subject<IUser> = new Subject<IUser>();
  newUser: Subject<IUser> = new Subject<IUser>();
  users: Observable<IUser[]>;
  updates: Subject<any> = new Subject<any>();
  currentUserId: string;
  currentUserSubject: Subject<string> = new Subject<string>();
  currentUser: IUser;
  userOnline: Subject<any> = new Subject<any>();
  tempUsers: { [key: string]: IUser } = {};
  loggedIn: boolean = false;

  constructor(private dataService: DataService, private socketService: SocketClientService) {
    
    this.newUser.subscribe(this.create);

    this.create
      .map((user: IUser): IUsersOperation => {

        return (users: IUser[]) => {
          return users.concat(user);
        }
      })
      .subscribe(this.updates);

    this.users = this.updates
      .scan((users: IUser[], operation: IUsersOperation) => operation(users), []);

    socketService.userOnline
      .map((user: IUser) => {
        return (users: IUser[]) => {
          return users.map((element: IUser) => {
            if (element._id === user._id) {
              element.availableInd = true;
            }
            return element;
          });
        }
      })
      .subscribe(this.updates);

    socketService.userOffline
      .map((_id: string) => {
        return (users: IUser[]) => {
          return users.map((element: IUser) => {
            if (element._id === _id) {
              element.availableInd = false;
            }
            return element;
          });
        }
      })
      .subscribe(this.updates);

    this.currentUserSubject.subscribe((userId: string) => {
      this.currentUserId = userId;
      this.loggedIn = true;
      this.getUsers();
    });

  }

  public addUser(user: IUser): void {
    this.newUser.next(user);
  }


  public getUsers(): void {
    this.dataService.getUsers()
      .subscribe((users: IUser[]) => {
        users.map((element: IUser) => {
          this.tempUsers[element._id] = element;
          if (element._id != this.currentUserId)
            this.addUser(element);
          else {
            this.currentUser = element;
          }
        });
        this.socketService.sendOnlineSignal(this.currentUser);
      });

  }

  public makeUserOnline(user: IUser) {
    initialUsers.map((element: IUser) => {
      if (element._id === user._id) {
        element.availableInd = false;
      }
      return element;
    });

  }
}
