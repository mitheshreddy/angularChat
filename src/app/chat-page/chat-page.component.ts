import { Component, OnInit } from '@angular/core';
import { IModalContent, ModalService } from '../chat-modal/chat-modal.service';
import { UserService } from '../services/user.service';
import { DataService } from '../services/data.service';

@Component({
  selector: 'chat-page',
  templateUrl: './chat-page.component.html',
  styleUrls: ['./chat-page.component.css']
})
export class ChatPageComponent implements OnInit {

  constructor(public modalService: ModalService,
    public userService: UserService,
    public dataService: DataService
  ) { }

  ngOnInit() {
    let user: string = localStorage.getItem("ChatUserName");    
    
    if (!user) {
      const modalContent: IModalContent = {
        header: 'Enter Name?',
        OKButtonText: 'Ok'
      }
      this.modalService.show(modalContent)
        .then((userName: string) => {
          console.log(userName);
          if (userName.trim().length > 0) {
            this.dataService.insertUser({ name: userName })
              .subscribe((id: string) => {
                localStorage.setItem("ChatUserName", id);
                this.userService.currentUserSubject.next(id);
              });
          }
        });      
    }
    else {
      this.userService.currentUserSubject.next(user);
    }
  }
}
