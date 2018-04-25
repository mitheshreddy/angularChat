import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';


import { AppComponent } from './app.component';
import { ChatPageComponent } from './chat-page/chat-page.component';
import { ModalModule } from './chat-modal/chat-modal.module';
import { ChatThreadsComponent } from './chat-threads/chat-threads.component';
import { DataService } from './services/data.service';
import { UserService } from './services/user.service';
import { HttpClientModule } from '@angular/common/http';
import { ChatThreadComponent } from './chat-thread/chat-thread.component';
import { ChatNavBarComponent } from './chat-nav-bar/chat-nav-bar.component';
import { SocketClientService } from './services/socket-client.service';
import { ChatWindowComponent } from './chat-window/chat-window.component';
import { MessageService } from './services/message.service';
import { ChatMessageComponent } from './chat-message/chat-message.component';
import { ThreadService } from './services/thread.service';
import { FromNowPipe } from './pipes/from-now.pipe';


@NgModule({
  declarations: [
    AppComponent,
    ChatPageComponent,
    ChatThreadsComponent,
    ChatThreadComponent,
    ChatNavBarComponent,
    ChatWindowComponent,
    ChatMessageComponent,
    FromNowPipe
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ModalModule,
    HttpClientModule
  ],
  providers: [DataService, UserService, SocketClientService, MessageService, ThreadService],
  bootstrap: [AppComponent]
})
export class AppModule { }
