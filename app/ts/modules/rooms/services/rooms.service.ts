import { Injectable } from '@angular/core';
import { Http, RequestOptionsArgs, Response } from '@angular/http';
import { IRoomsService, Room, RoomParams } from '../api';
import RoomAgent from '../RoomAgent';
//
// Funky stuff to get Observable typing and for map, toPromise methods to be defined.
//
import { Observable } from 'rxjs/Observable';
// Observable operators.
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

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
        const options: RequestOptionsArgs = {};
        const body = params;
        const observable: Observable<Response> = this.http.post('/rooms', body, options);
        return observable
            .map(function (response) { return response.json() as Room; })
            .map(function (room) { return new RoomAgent(room.id, room.owner); })
            .toPromise<RoomAgent>();
    }

    /**
     * Gets a room (agent).
     */
    getRoom(roomId: string): Promise<RoomAgent> {
        const observable: Observable<Response> = this.http.get(`/rooms/${roomId}`);
        return observable
            .map(function (response) { return response.json() as Room; })
            .map(function (room) { return new RoomAgent(room.id, room.owner); })
            .toPromise<RoomAgent>();
    }

    /**
     * Destroys a room.
     */
    destroyRoom(roomId: string): Promise<boolean> {
        const observable: Observable<Response> = this.http.delete(`/rooms/${roomId}`);
        return observable
            .map(function (response) { return response.json(); })
            .toPromise<boolean>();
    }
}
