import * as ng from 'angular';
import { IRoomsService, Room, RoomParams } from '../api';
import RoomAgent from '../RoomAgent';

/**
 * 
 */
export default class RoomsService implements IRoomsService {
    public static $inject: string[] = ['$http', '$q'];

    /**
     * 
     */
    constructor(private $http: ng.IHttpService, private $q: ng.IQService) {
        // Do nothing yet.
    }

    /**
     * Creates a room
     */
    createRoom(params: RoomParams): ng.IPromise<RoomAgent> {
        const d = this.$q.defer<RoomAgent>();
        this.$http.post<Room>('/rooms', params)
            .then(function (promiseValue) {
                const room = promiseValue.data;
                if (room) {
                    // console.lg(`getRoom => ${JSON.stringify(room, null, 2)}`);
                    const agent = new RoomAgent(room.id, room.owner);
                    d.resolve(agent);
                }
                else {
                    d.reject(new Error("room is not available."));
                }
            })
            .catch(function (reason: { data: string; status: number; statusText: string }) {
                d.reject(reason);
            });
        return d.promise;
    }

    /**
     * 
     */
    getRoom(roomId: string): ng.IPromise<RoomAgent> {
        const d = this.$q.defer<RoomAgent>();
        this.$http.get<Room>(`/rooms/${roomId}`)
            .then(function (promiseValue) {
                const room = promiseValue.data;
                if (room) {
                    // console.lg(`getRoom => ${JSON.stringify(room, null, 2)}`);
                    const agent = new RoomAgent(room.id, room.owner);
                    d.resolve(agent);
                }
                else {
                    d.reject(new Error("room is not available"));
                }
            })
            .catch(function (reason: { data: string; status: number; statusText: string }) {
                switch (reason.status) {
                    case 404: {
                        d.reject(new Error(`The room '${roomId}' could not be found.`));
                        break;
                    }
                    default: {
                        d.reject(new Error(reason.statusText));
                    }
                }
            });
        return d.promise;
    }

    destroyRoom(roomId: string): ng.IPromise<boolean> {
        const d = this.$q.defer<boolean>();
        this.$http.delete<boolean>(`/rooms/${roomId}`)
            .then(function (promiseValue) {
                d.resolve(true);
            })
            .catch(function (reason: { data: string; status: number; statusText: string }) {
                d.reject(reason);
            });
        return d.promise;
    }
}
