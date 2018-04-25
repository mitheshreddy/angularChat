import { Injectable } from "@angular/core";
import { Observable } from "rxjs/Observable";
import { HttpClient, HttpErrorResponse, HttpParams, HttpHeaders } from "@angular/common/http";
import { map, catchError } from "rxjs/operators";
import { IUser } from "../model/user";
import { UserService } from "./user.service";

@Injectable()
export class DataService {
    userBaseUrl: string = '/api/users';
    messageBaseUrl: string = '/api/messages'
    constructor(private http: HttpClient) { }
    insertUser(obj: any): Observable<string> {
        return this.http.post<string>(this.userBaseUrl, obj)
            .pipe(catchError(this.handleError))
    }

    getUsers(): Observable<IUser[]> {
        return this.http.get<IUser[]>(this.userBaseUrl)
            .pipe(catchError(this.handleError));
    }

    getMessages(obj: any): Observable<any[]> {
        let header = new HttpHeaders({ 'Content-Type': 'application/json' });
        let params = new HttpParams().set("id1", obj.id1).set("id2", obj.id2);
        return this.http.get<any[]>(this.messageBaseUrl, { headers: header, params: params })
            .pipe(catchError(this.handleError));
    }

    private handleError(error: HttpErrorResponse) {
        console.error('server error', error);
        if (error.error instanceof Error) {
            let errMessage = error.error.message;
            return Observable.throw(errMessage);
            // Use the following instead if using lite-server
            //return Observable.throw(err.text() || 'backend server error');
        }
        return Observable.throw(error || 'Node.js server error');
    }

}