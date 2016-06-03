import * as ng from 'angular';
import RoomParams from './RoomParams';
import Room from './Room';
import RoomAgent from './RoomAgent';
import MissionControl from '../../../services/mission/MissionControl';

/**
 * 
 */
export default class RoomsService {
    public static $inject: string[] = [
        '$http',
        '$q',
        'missionControl'
    ];

    /**
     * 
     */
    constructor(
        private $http: ng.IHttpService,
        private $q: ng.IQService,
        private missionControl: MissionControl
    ) {
        // Do nothing yet.
    }

    /**
     * Creates a room
     */
    createRoom(params: RoomParams): ng.IPromise<RoomAgent> {
        const d = this.$q.defer<RoomAgent>();
        this.$http.post<Room>('/rooms', params)
            .then(function(promiseValue) {
                const room = promiseValue.data;
                const agent = new RoomAgent(room.id);
                d.resolve(agent);
            })
            .catch(function(reason: { data: string; status: number; statusText: string }) {
                d.reject(reason);
            });
        return d.promise;
    }

    getRoom(id: string): ng.IPromise<RoomAgent> {
        const d = this.$q.defer<RoomAgent>();
        this.$http.get<Room>(`/rooms/${id}`)
            .then(function(promiseValue) {
                const room = promiseValue.data;
                const agent = new RoomAgent(room.id);
                d.resolve(agent);
            })
            .catch(function(reason: { data: string; status: number; statusText: string }) {
                d.reject(reason);
            });
        return d.promise;
    }
}
