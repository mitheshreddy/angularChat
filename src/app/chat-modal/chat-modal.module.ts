import { NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalComponent } from './chat-modal.component';
import { ModalService } from './chat-modal.service';

@NgModule({
    declarations: [ModalComponent],
    imports: [ CommonModule ],
    exports: [ModalComponent],
    providers: [ModalService],
})
export class ModalModule  {
   
}