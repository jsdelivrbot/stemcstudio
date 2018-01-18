import { Injectable } from '@angular/core';
import { Http, RequestOptionsArgs, Response } from '@angular/http';
import { IRoomsService, Room, RoomParams } from '../api';
import { RoomAgent } from '../RoomAgent';
//
// Funky stuff to get Observable typing and for map, toPromise methods to be defined.
//
import { Observable } from 'rxjs/Observable';
// Observable operators.
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
// import { ErrorObservable } from 'rxjs/observable/ErrorObservable';

/**
 *
 */
@Injectable()
export class RoomsService implements IRoomsService {

    /**
     * 
     */
    constructor(private http: Http) {
        // Do nothing yet.
    }

    /**
     * Creates a room (agent).
     */
    createRoom(params: RoomParams): Promise<RoomAgent> {
        // console.lg(`createRoom(params=${JSON.stringify(params)})`);
        const options: RequestOptionsArgs = {};
        const body = params;
        const observable: Observable<Response> = this.http.post('/rooms', body, options);
        return observable
            .map(function (response) { return response.json() as Room; })
            .map(function (room) { return new RoomAgent(room.id, room.owner); })
            .toPromise<RoomAgent>();
    }

    /**
     * Determines whether the room exists.
     * If the room exists then the promise resolves (then).
     * If the room does not exist then the promise rejects (catch).
     */
    existsRoom(roomId: string): Promise<void> {
        const observable: Observable<Response> = this.http.get(`/rooms/${roomId}`);
        return observable
            .map(function (response) { return response.json() as Room; })
            .map(function (room) { return void 0; })
            .toPromise();
    }

    /**
     * Gets a room (agent).
     */
    getRoom(roomId: string): Promise<RoomAgent> {
        // console.lg(`getRoom(roomId=${roomId})`);
        const observable: Observable<Response> = this.http.get(`/rooms/${roomId}`);
        return observable
            .map(function (response) { return response.json() as Room; })
            .map(function (room) { return new RoomAgent(room.id, room.owner); })
            .toPromise();
    }

    /**
     * Destroys a room.
     */
    destroyRoom(roomId: string): Promise<void> {
        // TODO: The message isn't very useful when the server goes away - "Response with status: 0 for URL: null".
        const observable: Observable<Response> = this.http.delete(`/rooms/${roomId}`);
        return observable
            .map(function (response) { return response.json(); })
            .toPromise();
    }

    // TODO: Possible error handling but .catch(this.handleError) does not compile.
    /*
    private handleError(error: any): ErrorObservable {
        // In a real world app, we might use a remote logging infrastructure
        // We'd also dig deeper into the error to get a better message
        const errMsg = (error.message) ? error.message :
            error.status ? `${error.status} - ${error.statusText}` : 'Server error';
        console.error(errMsg); // log to console instead
        return Observable.throw(errMsg);
    }
    */
}
