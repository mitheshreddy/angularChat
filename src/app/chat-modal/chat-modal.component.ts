import { Component, OnInit } from '@angular/core';
import { IModalContent, ModalService } from './chat-modal.service';
declare const gapi: any;
@Component({
    selector: 'chat-modal',
    templateUrl: './chat-modal.component.html',
    styleUrls: ['./chat-modal.component.css']
})
export class ModalComponent implements OnInit {

    modalVisible = false;
    modalVisibleAnimate = false;
    modalContent: IModalContent = {};
    cancel: () => void;
    ok: (string) => void;
    defaultModalContent: IModalContent = {
        header: 'Please Confirm',
        body: 'Are you sure you want to continue?',
        cancelButtonText: 'Cancel',
        OKButtonText: 'OK',
        cancelButtonVisible: true
    };

    public auth2: any;


    constructor(private modalService: ModalService) {
        modalService.show = this.show.bind(this);
        modalService.hide = this.hide.bind(this);
    }

    ngOnInit() {
        //this.googleInit();
    }

    ngAfterViewInit() {

    }

    show(modalContent: IModalContent) {
        this.modalContent = Object.assign(this.defaultModalContent, modalContent);
        this.modalVisible = true;
        setTimeout(() => this.modalVisibleAnimate = true);

        const promise = new Promise<string>((resolve, reject) => {
            this.ok = (userName) => {
                this.hide();
                resolve(userName);
            }
        });
        return promise;

    }

    hide() {
        this.modalVisibleAnimate = false;
        setTimeout(() => this.modalVisible = false, 300)
    }

    public googleInit() {
        gapi.load('auth2', () => {
            this.auth2 = gapi.auth2.init({
                client_id: '979885084187-p5vhtmuo7n15mkga60ksu52lgv5v92ta.apps.googleusercontent.com',
                cookiepolicy: 'single_host_login',
                scope: 'profile email'
            });

            this.attachSignIn(document.getElementById('googleBtn'));

        });
    }

    public attachSignIn(element) {
        this.auth2.attachClickHandler(element, {},
            (googleUser) => {

                let profile = googleUser.getBasicProfile();
                console.log(profile);
                console.log('Token || ' + googleUser.getAuthResponse().id_token);
                console.log('ID: ' + profile.getId());
                console.log('Name: ' + profile.getName());
                console.log('Image URL: ' + profile.getImageUrl());
                console.log('Email: ' + profile.getEmail());
            }, (error) => {
                alert(JSON.stringify(error, undefined, 2));
            });
    }
}